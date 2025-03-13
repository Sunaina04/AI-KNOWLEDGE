import re
import json

with open("legal_agreement.txt", "r") as file:
    agreement_text = file.read()

parties_match = re.search(r'between ([\w\s]+) and ([\w\s]+)', agreement_text)

parties = [parties_match.group(1), parties_match.group(2)] if parties_match else ["N/A", "N/A"]
payment_amount = re.findall(r'\$\d+(?:,\d+)?', agreement_text)  
payment_date = re.findall(r'on (\d{1,2}\w{2} \w+ \d{4})', agreement_text)
description = re.findall(r'purpose of this agreement is (.*)', agreement_text)

data = {
    "parties": parties,
    "paymentAmount": payment_amount[0] if payment_amount else "N/A",
    "paymentMethod": "Bank Transfer", 
    "paymentDate": payment_date[0] if payment_date else "N/A",
    "description": description[0] if description else "N/A"
}

json_output = json.dumps(data, indent=4)
print(json_output)

with open("output.json", "w") as json_file:
    json_file.write(json_output)

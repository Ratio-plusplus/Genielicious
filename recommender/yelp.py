import requests
import json

# # # DO NOT share to public. 
ID = "HGpbSO_Z-NroXybG4hEhMA"
API_Key = "re4-uLGVv2U8myNYYl6cvRUa2X4KPgJX8uLW6A2IE1sgtBkc1f7FtzBlwewAzssH4THfKqs0yD2MWboCPJb8ulFkNjwR0J0Ujqu8FFE8prTEXlLamAkdo0oF56V0ZnYx"
# # #

def get_store(location,term):
    url = "https://api.yelp.com/v3/businesses/search"

    query = {"location": location, "term": term}

    payload = ""
    headers = {
        "Authorization": f"Bearer {API_Key}"
    }

    response = requests.request(
        "GET", url, data=payload, headers=headers, params=query
    )
    return response.json()

res = get_store("Long Beach", "boba")

# Write to results file to avoid making too many calls
with open('results.txt', 'w') as file:
    json.dump(res, file, indent=4)
print("Dictionary written to file in JSON format.")

print(f"huh\n{res}")
for bus in res["businesses"]:
    for key,val in bus.items():
        print(f"{key}: {val}")
    print()

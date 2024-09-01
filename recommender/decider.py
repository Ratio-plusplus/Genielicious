import json
from pprint import pprint

dietary_restrictions = {"eggs", "peanuts"} ### keep these in mind

candidate_flavors = dict() # dict of flavors paired with their foods
food_data = {}
wanted_flavors = []
unwanted_flavors = []
undecided_flavors = [] # maybe use, we could use something more complex
food_freq = dict()
with open("recommender/mock_food_data.json","r") as file:
    food_data = json.load(file)

for item in food_data["food_items"]:
    for flavor in item["flavors"]:
        if flavor in candidate_flavors:
            candidate_flavors[flavor].add(item["name"])
        else:
            candidate_flavors[flavor] = {item["name"]}

# pprint(candidate_flavors)

for flavor in candidate_flavors:
    choice = -1
    while True:

        choice = str(input(f"Do you want something {flavor}? (y/n/m)"))

        if choice not in ("y", "n", "m"):
            print("invalid input")
        else:
            break
    if choice == "y":
        wanted_flavors.append(flavor)
    elif choice == "m":
        undecided_flavors.append(flavor)
    else:
        unwanted_flavors.append(flavor)

for flav in unwanted_flavors:
    candidate_flavors.pop(flav)


for flavor in candidate_flavors:
    for item in candidate_flavors[flavor]:
        if item in food_freq:
            food_freq[item] += 1
        else:
            food_freq[item] = 1

predictions = dict(sorted(food_freq.items(), key=lambda item: item[1], reverse=True))
        

print("Predictions in descending order:")

# pprint(candidate_flavors)
pprint(predictions,sort_dicts=False)
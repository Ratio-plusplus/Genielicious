import json
file_path = "recommender/results/all_business_categories.json"
output_path = "recommender/results/"
with open(file_path, 'r') as file:
    res = json.load(file)

# print(type(res))
food_dicts = []
for cat in res["categories"]:
    parents = []
    for parent in cat["parent_aliases"]:
        parents.append(parent)
    if ("food" in parents or 
        "restaurants" in parents or
        "gourmet" in parents):
        food_dicts.append(cat)

cats = {
    "categories": food_dicts
}
with open(output_path+'all_possible_food_categories.json', 'w') as file:
    json.dump(cats, file, indent=4)
print("Dictionary written to file in JSON format.")
from parser import parse_question


questions = [
    "Show revenue by country",
    "Show profit by category",
    "Show revenue and profit by region",
    "Show cost by sales channel",
    "Show margin by segment",
]


for question in questions:
    print("\nQuestion:", question)

    query = parse_question(question)

    print("Measures:", query.measures)
    print("Dimensions:", query.dimensions)
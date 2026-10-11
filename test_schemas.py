import unittest
from schemas import SemanticQuery


class TestSemanticQuery(unittest.TestCase):

    def test_valid_query(self):
        query = SemanticQuery(
            measures=["Sales.revenue"],
            dimensions=["Sales.country"],
            filters={"Sales.country": "India"},
            time_range="last month",
        )

        self.assertEqual(query.measures, ["Sales.revenue"])
        self.assertEqual(query.dimensions, ["Sales.country"])
        self.assertEqual(query.filters["Sales.country"], "India")
        self.assertEqual(query.time_range, "last month")

    def test_default_values(self):
        query = SemanticQuery(measures=["Sales.profit"])

        self.assertEqual(query.dimensions, [])
        self.assertEqual(query.filters, {})
        self.assertIsNone(query.time_range)


if __name__ == "__main__":
    unittest.main()

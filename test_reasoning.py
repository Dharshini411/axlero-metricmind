
import unittest

from reasoning import (
    calculate_change,
    is_comparison_question,
)


class TestReasoning(unittest.TestCase):

    def test_calculate_increase(self):
        result = calculate_change(
            [{"Sales.profit": 100}],
            [{"Sales.profit": 120}],
            "profit",
        )

        self.assertEqual(result["difference"], 20.0)
        self.assertEqual(result["percentage_change"], 20.0)

    def test_calculate_decrease(self):
        result = calculate_change(
            [{"Sales.revenue": 200}],
            [{"Sales.revenue": 150}],
            "revenue",
        )

        self.assertEqual(result["difference"], -50.0)
        self.assertEqual(result["percentage_change"], -25.0)

    def test_zero_july_value(self):
        result = calculate_change(
            [{"Sales.profit": 0}],
            [{"Sales.profit": 50}],
            "profit",
        )

        self.assertIsNone(result["percentage_change"])

    def test_missing_comparison_data(self):
        with self.assertRaises(ValueError):
            calculate_change(
                [],
                [{"Sales.profit": 120}],
                "profit",
            )

    def test_detect_comparison_question(self):
        self.assertTrue(
            is_comparison_question(
                "Did revenue increase from July to August?"
            )
        )

    def test_non_comparison_question(self):
        self.assertFalse(
            is_comparison_question(
                "What is our total revenue?"
            )
        )


if __name__ == "__main__":
    unittest.main()

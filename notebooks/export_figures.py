import pandas as pd
import matplotlib.pyplot as plt

results = pd.read_csv("docs/intervention_results.csv")

plt.figure(figsize=(10, 6))

results.plot(
    x="Scenario",
    y="Average Cooling",
    kind="bar",
    legend=False,
    ax=plt.gca()
)

plt.ylabel("Cooling (°C)")

plt.title(
    "Average Cooling Benefits Across Intervention Strategies"
)

plt.xticks(
    rotation=45,
    ha="right"
)

plt.tight_layout()

plt.savefig(
    "docs/intervention_comparison.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved docs/intervention_comparison.png")
import pandas as pd
from sklearn.model_selection import train_test_split

# Load dataset
df = pd.read_csv(
    "data/processed/delhi_heat_dataset_v1.csv"
)

print("Dataset loaded successfully.")
print(f"Shape: {df.shape}")

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

# Features used for modeling
feature_columns = [
    'mean_ndvi',
    'mean_ndbi'
]

X = df[feature_columns]

# Target variable
y = df['mean_lst']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Save processed datasets
X_train.to_csv(
    "data/processed/X_train.csv",
    index=False
)

X_test.to_csv(
    "data/processed/X_test.csv",
    index=False
)

y_train.to_frame().to_csv(
    "data/processed/y_train.csv",
    index=False
)

y_test.to_frame().to_csv(
    "data/processed/y_test.csv",
    index=False
)

print("\nDataset preparation completed successfully.")

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

print("\nFeature columns:")
print(X.columns.tolist())
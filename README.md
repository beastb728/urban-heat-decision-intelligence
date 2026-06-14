# Urban Heat Intelligence Platform

![Status](https://img.shields.io/badge/Status-v1.0-success)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-Remote%20Sensing-green)
![Landsat 8](https://img.shields.io/badge/Landsat-8-success)
![XGBoost](https://img.shields.io/badge/XGBoost-Machine%20Learning-orange)
![SHAP](https://img.shields.io/badge/SHAP-Explainable%20AI-purple)
![Streamlit](https://img.shields.io/badge/Streamlit-Dashboard-red?logo=streamlit)
![GitHub last commit](https://img.shields.io/github/last-commit/beastb728/urban-heat-decision-intelligence)
![GitHub repo size](https://img.shields.io/github/repo-size/beastb728/urban-heat-decision-intelligence)

> An explainable geospatial AI platform for understanding, predicting, and mitigating urban heat using satellite-derived environmental indicators and machine learning.

---

## Problem Statement

Rapid urbanization has intensified the **Urban Heat Island (UHI)** effect, increasing energy demand, reducing thermal comfort, and exacerbating heat-related health risks during extreme heat events.

While cities often know **where** heat occurs, understanding **why** it occurs and **which mitigation strategies are most effective** remains challenging.

The **Urban Heat Intelligence Platform** addresses this gap by integrating **remote sensing**, **physics-aware machine learning**, **explainable AI**, and **scenario-based intervention analysis** into an interactive decision-support system for urban heat mitigation.

Using **Delhi, India** as a case study, the platform predicts **Land Surface Temperature (LST)** patterns, identifies the environmental drivers of urban heat, and evaluates mitigation strategies such as urban greening and cool roofs.

---

## Key Features

- Land Surface Temperature modelling using Landsat 8 imagery
- Physics-aware environmental feature engineering (NDVI, NDBI, NDWI, Albedo, Emissivity)
- Explainable AI using SHAP (global importance, local explanations, threshold effects)
- Scenario-based global and targeted intervention simulations
- Interactive Streamlit dashboard for decision support

---

## Final Model Performance

The final deployed model was a **physics-aware XGBoost regressor** trained on satellite-derived environmental indicators across a 250 m planning grid covering Delhi.

| Metric   | Random Forest Baseline | XGBoost (Physics-Aware) |
| -------- | ---------------------- | ----------------------- |
| **R²**   | 0.612                  | **0.710**               |
| **RMSE** | 3.140 °C               | **2.591 °C**            |
| **MAE**  | 2.043 °C               | **1.656 °C**            |

Physics-aware feature engineering (monotonic constraints aligned with thermodynamic relationships) improved R² by ~10 percentage points over the baseline Random Forest.

---

## Methodological Workflow

```text
Landsat 8 Imagery (Band 10 — Thermal Infrared)
        ↓
Land Surface Temperature Derivation
(Radiative transfer + emissivity correction)
        ↓
Environmental Feature Engineering
(NDVI, NDBI, NDWI, Albedo, Emissivity at 250 m grid)
        ↓
Physics-Aware XGBoost Modelling
(Monotonic constraints: NDVI ↓ LST, NDBI ↑ LST, NDWI ↓ LST)
        ↓
SHAP Explainability
(Global importance, local predictions, threshold detection)
        ↓
Intervention Simulation
(Global and targeted hotspot scenarios)
        ↓
Decision Support Dashboard (Streamlit)
```

---

## Environmental Indicators

The following predictors were derived from Landsat 8 imagery and incorporated into the modelling framework:

| Variable     | Description                   | Expected Relationship with LST |
| ------------ | ----------------------------- | ------------------------------ |
| **NDVI**     | Vegetation availability       | Negative (cooling)             |
| **NDBI**     | Built-up intensity            | Positive (heating)             |
| **NDWI**     | Surface moisture conditions   | Negative (cooling)             |
| **Albedo**   | Surface reflectivity          | Negative (reduces heat absorption) |
| **Emissivity** | Thermal radiation properties | Positive (affects LST retrieval) |

---

## Explainable AI

SHAP (SHapley Additive exPlanations) was used to investigate:

- Global feature importance across all predictions
- Local prediction explanations for individual grid cells
- Nonlinear relationships between environmental predictors and temperature
- Threshold effects (e.g., the NDVI level at which cooling benefits plateau)

### SHAP Summary Plot

![SHAP Summary](docs/shap_summary.png)

### Key Insights

- **Built-up intensity (NDBI)** emerged as the strongest contributor to urban heating — dense impervious surfaces drive the largest positive LST deviations.
- **Vegetation (NDVI)** demonstrated substantial cooling effects, with marginal cooling benefits diminishing above an NDVI of approximately 0.4.
- **Surface moisture (NDWI)** contributed meaningfully to temperature reductions through evaporative cooling.
- **Surface reflectivity (Albedo)** played an important role in mitigating heat accumulation by reducing absorbed solar radiation.

---

## Intervention Simulator

The calibrated XGBoost model was used to simulate LST reductions under hypothetical urban heat mitigation scenarios by modifying the relevant environmental features and re-running predictions.

### Global Interventions
Applied to all urban grid cells across Delhi:
- **Urban Greening** — NDVI increased to represent increased vegetation cover
- **Cool Roof Programs** — Albedo increased to represent reflective roofing materials
- **Combined Strategy** — Both greening and cool roofs applied simultaneously

### Targeted Interventions
Applied only to the hottest **10%** of urban grid cells (LST hotspots):
- **Targeted Greening**
- **Targeted Cool Roofs**
- **Targeted Combined Strategy**

> **Note on interpreting results:** Global scenarios modify all grid cells simultaneously, which compounds cooling effects across the city and produces large average reductions. Targeted scenarios affect only ~10% of cells, so city-wide averages are lower — but local cooling at treated hotspot locations can be substantial (see maximum cooling column).

---

## Intervention Results

| Scenario              | Cells Modified | Average Cooling (°C) | Maximum Cooling (°C) |
| --------------------- | -------------- | -------------------- | -------------------- |
| Global Greening       | 100%           | 8.06                 | 20.89                |
| Global Cool Roofs     | 100%           | 6.11                 | 18.70                |
| Global Combined       | 100%           | 14.67                | 29.22                |
| Targeted Greening     | ~10%           | 1.04 (city-wide avg) | 16.53 (at hotspots)  |
| Targeted Cool Roofs   | ~10%           | 0.72 (city-wide avg) | 13.98 (at hotspots)  |
| Targeted Combined     | ~10%           | 1.53 (city-wide avg) | 22.19 (at hotspots)  |

### Cooling Comparison

![Intervention Comparison](docs/intervention_comparison.png)

### Planning Insights

- **Global interventions** produced the largest city-wide average cooling benefits but require large-scale, resource-intensive implementation.
- **Targeted hotspot interventions** achieved meaningful localized cooling (up to 22°C at specific locations) while affecting a substantially smaller portion of the urban landscape.
- **Strategic hotspot prioritization** may offer a practical compromise between effectiveness and implementation feasibility, particularly for resource-constrained municipalities.

---

## Limitations

- **Single city:** The model was trained and evaluated exclusively on Delhi. Generalizability to other cities with different urban morphologies or climates is not established.
- **Single sensor and season:** Analysis is based on Landsat 8 imagery from a limited temporal window. Seasonal LST variability and inter-annual trends are not captured.
- **No meteorological variables:** Wind speed, humidity, and air temperature — all of which influence LST — are not incorporated in the current feature set.
- **Spatial autocorrelation:** Standard cross-validation was used; spatial cross-validation (blocking) was not applied, which may lead to optimistic performance estimates.
- **Simulation assumptions:** Intervention scenarios assume that changing NDVI or Albedo inputs leads to proportional LST changes as learned by the model. Real-world implementation effects may differ.

---

## Dashboard

The Urban Heat Intelligence Platform includes an interactive Streamlit dashboard providing:

- Project overview and methodology
- Model performance summaries and diagnostics
- SHAP-based explainability outputs
- Intervention simulation results and comparisons
- Methodological documentation

```bash
streamlit run app/dashboard.py
```

---

## Project Structure

```text
urban_heat_decision_intelligence/
├── app/
│   └── dashboard.py                  # Streamlit dashboard
│
├── data/
│   ├── external/                     # External reference data
│   ├── processed/                    # Cleaned and feature-engineered datasets
│   └── raw/                          # Raw Landsat 8 exports from Google Earth Engine
│
├── docs/
│   ├── intervention_comparison.png   # Intervention results visualisation
│   ├── intervention_results.csv      # Numerical simulation outputs
│   ├── methodology.md                # Detailed methodology notes
│   ├── shap_summary.png              # SHAP summary plot
│   └── screenshots/                  # Dashboard screenshots
│
├── notebooks/
│   ├── 01_eda.ipynb                  # Exploratory data analysis
│   ├── 02_random_forest_baseline.ipynb
│   ├── 03_xgboost.ipynb
│   ├── 04_prepare_dataset_v16.ipynb  # Final dataset preparation
│   ├── 05_random_forest_v16.ipynb    # Baseline model (v16 features)
│   ├── 06_xgboost_v16.ipynb          # XGBoost model (v16 features)
│   ├── 07_monotonic_xgboost.ipynb    # Physics-aware XGBoost (final model)
│   ├── 08_shap_analysis.ipynb        # SHAP explainability
│   └── 09_intervention_simulator.ipynb
│
├── src/                              # Source modules (in development)
├── tests/                            # Unit tests (in development)
├── README.md
└── requirements.txt
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/beastb728/urban-heat-decision-intelligence.git
cd urban-heat-decision-intelligence
```

Create and activate a virtual environment (Python 3.12 recommended):

```bash
python -m venv urban_heat

# Linux / macOS
source urban_heat/bin/activate

# Windows
urban_heat\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the dashboard:

```bash
streamlit run app/dashboard.py
```

---

## Technologies Used

| Category           | Tools                                      |
| ------------------ | ------------------------------------------ |
| Remote Sensing     | Google Earth Engine, Landsat 8             |
| Data Processing    | Python 3.12, Pandas, NumPy                 |
| Machine Learning   | Scikit-learn, XGBoost                      |
| Explainability     | SHAP                                       |
| Visualisation      | Matplotlib                                 |
| Dashboard          | Streamlit                                  |

---

## Key Contributions

- Developed an end-to-end remote sensing pipeline for deriving urban thermal indicators from Landsat 8 imagery using Google Earth Engine.
- Constructed a city-scale urban heat dataset using a 250 m planning grid over Delhi.
- Improved predictive performance through physics-aware feature engineering and monotonic XGBoost constraints grounded in thermodynamic relationships.
- Integrated SHAP-based explainable AI to uncover the primary environmental drivers of urban heat.
- Built a scenario-based intervention simulator to quantify the cooling potential of urban greening and cool roof strategies.
- Deployed the full workflow as an interactive Streamlit decision-support dashboard.

---

## Future Work

- Integration of meteorological variables (wind speed, humidity, air temperature)
- Spatial cross-validation frameworks to reduce spatial autocorrelation bias
- Interactive hotspot mapping within the dashboard
- User-defined intervention scenarios with custom parameter inputs
- Multi-city comparative analyses to test model generalizability
- Physics-Informed Neural Networks (PINNs) for thermodynamically consistent modelling

---

## Author

**Ishaan**
Undergraduate Engineering Student
[GitHub](https://github.com/beastb728)

---

## License

This project is released for educational and research purposes.
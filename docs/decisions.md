# Project Decisions

## Decision 001: Spatial Unit Selection

**Decision:**
Use a **250 m × 250 m planning grid** as the primary spatial unit of analysis.

**Rationale:**

* Provides a planner-friendly representation of urban space.
* Reduces computational burden compared to pixel-level analysis.
* Produces a structured dataset suitable for machine learning workflows.
* Balances spatial detail with model scalability.

---

## Decision 002: Target Variable Selection

**Decision:**
Use **Land Surface Temperature (LST)** as the target variable.

**Rationale:**

* Directly captures the thermal characteristics of urban surfaces.
* More appropriate for satellite-based urban heat studies than near-surface air temperature.
* Closely aligned with urban heat island literature and mitigation planning applications.

---

## Decision 003: LST Derivation Strategy

**Decision:**
Derive Land Surface Temperature manually from Landsat imagery.

**Rationale:**

* Establishes a stronger remote sensing foundation.
* Demonstrates understanding of the complete retrieval workflow.
* Produces a transparent and research-oriented methodology.
* Improves reproducibility compared with relying on precomputed products.

---

## Decision 004: Landsat Acquisition Strategy

**Decision:**
Construct a mosaic from multiple Landsat scenes.

**Rationale:**

* Delhi spans multiple WRS path-row combinations.
* Individual scenes resulted in incomplete spatial coverage.
* Mosaicking ensured consistent city-wide analysis.

---

## Decision 005: Baseline Machine Learning Strategy

**Decision:**
Develop interpretable baseline models using NDVI and NDBI as predictors of Land Surface Temperature.

**Rationale:**

* Establishes whether urban morphology alone can explain thermal variability.
* Provides a benchmark before introducing additional datasets.
* Enables direct assessment of vegetation and built-up influences on urban heat.

### Random Forest Results

* RMSE: **3.74 °C**
* MAE: **2.31 °C**
* R²: **0.397**

### XGBoost Results

* RMSE: **3.48 °C**
* MAE: **2.08 °C**
* R²: **0.477**

### Key Findings

* Both models identified **NDBI** as the dominant predictor of urban heat.
* **NDVI** exhibited a meaningful mitigating influence on Land Surface Temperature.
* Urban morphology alone explained a substantial proportion of Delhi's thermal variability.
* Additional environmental and socio-economic variables are likely required to fully characterize urban heat dynamics.

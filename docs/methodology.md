# Methodology

## Overview

This project aims to develop an Urban Heat Intelligence Platform capable of identifying urban heat drivers and supporting evidence-based cooling interventions. The system integrates remote sensing, geospatial analysis, machine learning, explainability, and optimization techniques to transform satellite observations into actionable urban insights.

The project follows a modular, phase-wise development approach to ensure reproducibility, scalability, and scientific rigor.

---

## Study Area

The initial implementation focuses on **Delhi, India**, one of the world's largest metropolitan regions and a city that frequently experiences severe heat stress during summer months.

Delhi was selected because of:

* High urban heat vulnerability,
* Diverse land-use characteristics,
* Availability of open geospatial datasets,
* Relevance to climate adaptation and urban planning.

---

## Spatial Unit of Analysis

Rather than performing analysis at the individual satellite pixel level, the study adopts a **grid-based approach**.

A regular planning grid is generated over the study area, and environmental variables are aggregated within each grid cell.

This approach was chosen because it:

* reduces noise associated with pixel-level measurements,
* improves computational efficiency,
* aligns more closely with urban planning applications,
* enables future optimization of interventions at actionable spatial scales.

Each grid cell represents a single observation in the machine learning dataset.

---

## Phase 1: Remote Sensing and Dataset Construction

The first phase focuses on constructing a machine-learning-ready dataset describing the thermal and environmental characteristics of Delhi.

### Satellite Data Sources

#### Landsat 8/9

Used for deriving:

* Land Surface Temperature (LST),
* Normalized Difference Vegetation Index (NDVI),
* Normalized Difference Built-up Index (NDBI).

Landsat imagery was selected because it provides thermal infrared bands necessary for estimating surface temperature.

---

### Image Preprocessing

Cloud-free scenes were identified and combined to generate a representative mosaic for the study period.

Preprocessing steps included:

1. Scene selection and quality assessment,
2. Cloud filtering,
3. Mosaic generation,
4. Spatial clipping to the Delhi boundary.

---

### Land Surface Temperature Estimation

Land Surface Temperature was derived using established remote sensing procedures involving:

1. Conversion of thermal bands to brightness temperature,
2. Estimation of vegetation fraction,
3. Surface emissivity calculation,
4. Emissivity correction of brightness temperature.

This workflow enables physically meaningful estimation of urban surface temperatures from satellite observations.

---

### Environmental Feature Engineering

Additional explanatory variables were derived from satellite imagery.

#### NDVI

NDVI was calculated to quantify vegetation presence and intensity.

Higher NDVI values generally indicate denser vegetation cover.

---

#### NDBI

NDBI was calculated to characterize built-up intensity.

Higher NDBI values are often associated with impervious urban surfaces.

---

### Grid-Level Aggregation

For each planning grid cell, summary statistics of environmental variables were computed.

Examples include:

* Mean LST,
* Mean NDVI,
* Mean NDBI.

The resulting dataset forms the basis for subsequent machine learning analyses.

---

## Dataset Output

The final output of Phase 1 is a structured tabular dataset where each row corresponds to a planning grid cell.

Example schema:

| Variable  | Description                       |
| --------- | --------------------------------- |
| Mean LST  | Average land surface temperature  |
| Mean NDVI | Vegetation indicator              |
| Mean NDBI | Built-up intensity indicator      |
| Geometry  | Spatial location of the grid cell |

This dataset serves as the primary input for later stages of the project.

---

## Future Methodological Extensions

Subsequent phases of the project will expand the analytical capabilities of the platform.

### Phase 2: Explainable Machine Learning

Objectives:

* Develop predictive models of urban heat patterns,
* Compare baseline and advanced regression algorithms,
* Identify dominant heat drivers using explainability techniques.

Planned methods include:

* Random Forest Regression,
* Gradient Boosting models,
* SHAP-based feature attribution.

---

### Phase 3: Intervention Simulation

Scenario-based analyses will be implemented to estimate the potential cooling effects of urban interventions.

Potential interventions include:

* Increased urban vegetation,
* Cool roof adoption,
* Green roof implementation.

Models will be used to estimate changes in land surface temperature under alternative planning scenarios.

---

### Phase 4: Optimization

The final phase aims to support decision-making under practical constraints.

Optimization frameworks will be explored to determine intervention strategies that maximize cooling benefits while accounting for limitations such as budget and implementation feasibility.

---

## Reproducibility

The project follows reproducible software engineering practices, including:

* modular source code organization,
* version-controlled datasets and scripts,
* documented methodological decisions,
* incremental project releases.

---

## Current Status

The project has completed **Phase 1: Remote Sensing and Dataset Construction**.

The resulting geospatial dataset provides the foundation for the next stage of development involving explainable machine learning and decision-support capabilities.

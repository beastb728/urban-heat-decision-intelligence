import streamlit as st
import pandas as pd
import os

# ======================================
# Page Configuration
# ======================================

st.set_page_config(
    page_title="Urban Heat Intelligence Platform",
    page_icon="🌡️",
    layout="wide"
)

# ======================================
# Title
# ======================================

st.title("Urban Heat Intelligence Platform")
st.markdown(
    """
    **An explainable geospatial AI system for understanding and mitigating urban heat in Delhi using Landsat-derived indicators and machine learning.**
    """
)

# ======================================
# Sidebar Navigation
# ======================================

page = st.sidebar.radio(
    "Navigate",
    [
        "Overview",
        "Heat Drivers",
        "Intervention Simulator",
        "Methodology"
    ]
)

# ======================================
# Overview Page
# ======================================

if page == "Overview":

    st.header("Project Overview")

    st.write(
        """
        This platform combines **remote sensing**, **machine learning**,
        and **explainable AI** to support evidence-based urban heat
        mitigation strategies.

        The study focuses on **Delhi, India**, using a **250 m planning grid**
        and Landsat-derived thermal indicators.
        """
    )

    st.subheader("Final Model Performance")

    col1, col2, col3 = st.columns(3)

    col1.metric(
        label="R²",
        value="0.710"
    )

    col2.metric(
        label="RMSE",
        value="2.591 °C"
    )

    col3.metric(
        label="MAE",
        value="1.656 °C"
    )

    st.subheader("Study Area")

    st.markdown(
        """
        - **City:** Delhi, India
        - **Satellite Platform:** Landsat 8
        - **Spatial Resolution:** 250 m
        - **Target Variable:** Land Surface Temperature (LST)
        """
    )

    st.subheader("Project Objectives")

    st.markdown(
        """
        - Identify urban heat patterns.
        - Understand the environmental drivers of heat.
        - Predict land surface temperatures using machine learning.
        - Simulate cooling interventions.
        - Support urban planning decisions.
        """
    )

# ======================================
# Heat Drivers Page
# ======================================

elif page == "Heat Drivers":

    st.header("Understanding Urban Heat Drivers")

    st.write(
        """
        SHAP (SHapley Additive exPlanations) was used to interpret
        the contribution of environmental variables to predicted
        land surface temperatures.
        """
    )

    st.subheader("Global Feature Importance")

    shap_path = os.path.join("docs", "shap_summary.png")

    if os.path.exists(shap_path):
        st.image(
            shap_path,
            caption="SHAP Summary Plot",
            use_container_width=True
        )
    else:
        st.warning(
            "SHAP summary plot not found."
        )

    st.subheader("Key Findings")

    st.markdown(
        """
        - **NDBI (Built-up intensity)** was the strongest driver of urban heat.
        - **NDVI (Vegetation)** exhibited a cooling influence.
        - **NDWI (Moisture availability)** contributed to temperature reductions.
        - **Albedo (Surface reflectivity)** demonstrated meaningful cooling effects.
        - **Emissivity** showed comparatively smaller contributions.
        """
    )

# ======================================
# Intervention Simulator Page
# ======================================

elif page == "Intervention Simulator":

    st.header("Intervention Strategies")

    st.write(
        """
        The final XGBoost model was used to estimate the cooling effects
        of various urban heat mitigation strategies.
        """
    )

    results_path = os.path.join(
        "docs",
        "intervention_results.csv"
    )

    if os.path.exists(results_path):

        results = pd.read_csv(
            results_path
        )

        st.subheader(
            "Intervention Outcomes"
        )

        st.dataframe(
            results,
            use_container_width=True
        )

    else:

        st.warning(
            "Intervention results file not found."
        )

    fig_path = os.path.join(
        "docs",
        "intervention_comparison.png"
    )

    if os.path.exists(fig_path):

        st.subheader(
            "Cooling Comparison"
        )

        st.image(
            fig_path,
            caption="Cooling Benefits Across Intervention Strategies",
            use_container_width=True
        )

    else:

        st.warning(
            "Intervention comparison figure not found."
        )

    st.subheader(
        "Planning Insights"
    )

    st.info(
        """
        **Global interventions** produced the largest city-wide cooling benefits.

        **Targeted hotspot interventions** achieved substantial localized
        cooling while affecting a much smaller portion of the urban landscape.

        These findings suggest that hotspot prioritization may offer a practical
        balance between intervention effectiveness and implementation feasibility.
        """
    )

# ======================================
# Methodology Page
# ======================================

elif page == "Methodology":

    st.header(
        "Methodology"
    )

    st.markdown(
        """
        ### 1. Remote Sensing

        - Landsat 8 imagery acquisition
        - Land Surface Temperature derivation
        - 250 m planning grid generation

        ### 2. Feature Engineering

        - NDVI (Vegetation)
        - NDBI (Built-up intensity)
        - NDWI (Moisture availability)
        - Surface emissivity
        - Surface albedo

        ### 3. Machine Learning

        - Random Forest baseline
        - XGBoost baseline
        - Physics-aware XGBoost
        - Monotonic XGBoost experiments

        ### 4. Explainability

        - SHAP global explanations
        - SHAP local explanations
        - Driver attribution analysis

        ### 5. Intervention Simulation

        - Global greening scenarios
        - Global cool roof scenarios
        - Targeted hotspot interventions
        - Combined mitigation strategies
        """
    )

    st.subheader(
        "Project Contributions"
    )

    st.markdown(
        """
        This project demonstrates the integration of:

        - Geospatial analytics
        - Thermal remote sensing
        - Explainable machine learning
        - Scenario-based intervention planning
        - Decision-support system design
        """
    )

# ======================================
# Footer
# ======================================

st.markdown("---")

st.caption(
    "Urban Heat Intelligence Platform • Built using Landsat 8, XGBoost, SHAP, and Streamlit"
)
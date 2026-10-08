import numpy as np
import pandas as pd
import streamlit as st

st.title("My First Streamlit App")

# Widgets return their current value
name = st.text_input("What's your name?", "World")
n_points = st.slider("Number of data points", min_value=10, max_value=200, value=50)
show_data = st.checkbox("Show raw data")

st.write(f"Hello, {name}!")

# Build some random data; it is regenerated each time a widget changes
data = pd.DataFrame(
    np.random.randn(n_points, 2),
    columns=["a", "b"],
)

st.line_chart(data)

if show_data:
    st.dataframe(data)

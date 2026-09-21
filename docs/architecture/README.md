# MetricMind Architecture

## Project Overview

MetricMind is an Agentic Semantic BI Engine that allows users to ask business questions in natural language and receive governed, consistent and explainable analytics results.

## System Workflow

User Question
    ↓
Next.js Frontend
    ↓
AI Agent / LangChain
    ↓
Semantic Layer
    ↓
dbt Models
    ↓
Database / Data Warehouse
    ↓
Query Result
    ↓
AI Explanation + Visualization

## Main Components

### 1. Raw Data
Contains the original MetricMind datasets used as the source for the project.

### 2. Database
Responsible for loading raw data, creating tables, verifying data types and performing data quality checks.

### 3. dbt
Responsible for transforming and preparing the raw data into structured models for analytics.

### 4. Semantic Layer
Defines governed business metrics and dimensions so that the same metric produces consistent results.

### 5. AI Agent
Interprets natural-language business questions and converts them into governed requests using the Semantic Layer.

### 6. API
Connects the AI Agent with the Semantic Layer and provides structured responses.

### 7. Frontend
Provides the conversational BI interface where users can ask questions and view results, tables and visualizations.

## Team Integration

Team A:
Raw Data → Database → dbt → Semantic Layer

Team B:
AI Agent → API → Frontend

Team Lead:
Integration → Governance → Testing → Documentation → Review

## Example User Query

"Show me European sales."

The system should interpret the question, use the governed semantic definitions, retrieve the correct data and return the result through the conversational interface.

## Governance

MetricMind should ensure that governed metrics use consistent definitions and that analytics queries are controlled to avoid incorrect or unnecessarily expensive queries.

## Transparency

The application should support transparency features such as viewing the generated SQL or API request where applicable.

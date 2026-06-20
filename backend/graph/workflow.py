from langgraph.graph import StateGraph, END

from graph.state import TeamState

from agents.product_manager import product_manager
from agents.architect import architect
from agents.reviewer import reviewer
from agents.backend_engineer import backend_engineer
from agents.frontend_engineer import frontend_engineer
from agents.coordinator import coordinator

workflow = StateGraph(TeamState)

# Nodes

workflow.add_node(
    "product_manager",
    product_manager
)

workflow.add_node(
    "architect",
    architect
)

workflow.add_node(
    "reviewer",
    reviewer
)

workflow.add_node(
    "backend_engineer",
    backend_engineer
)

workflow.add_node(
    "frontend_engineer",
    frontend_engineer
)

workflow.add_node(
    "coordinator",
    coordinator
)

# Entry Point

workflow.set_entry_point(
    "product_manager"
)

# Flow

workflow.add_edge(
    "product_manager",
    "architect"
)

workflow.add_edge(
    "architect",
    "reviewer"
)

# Parallel Generation

workflow.add_edge(
    "reviewer",
    "backend_engineer"
)

workflow.add_edge(
    "reviewer",
    "frontend_engineer"
)

# Merge Results

workflow.add_edge(
    "backend_engineer",
    "coordinator"
)

workflow.add_edge(
    "frontend_engineer",
    "coordinator"
)

# Finish

workflow.add_edge(
    "coordinator",
    END
)

app = workflow.compile()
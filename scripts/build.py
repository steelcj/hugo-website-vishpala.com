#!/usr/bin/env python3
"""
build.py — Vishpala.com build and deploy pipeline executor.

Reads scripts/build.yaml and executes the declared steps in order.
Every step is visible in the YAML — nothing is hardcoded here.

Usage:
    python scripts/build.py [stage]

    stage: name of the stage to run (default: build)
           available stages are defined in scripts/build.yaml

Examples:
    python scripts/build.py          # runs the 'build' stage
    python scripts/build.py build    # same
    python scripts/build.py deploy   # runs the 'deploy' stage
"""

import shutil
import subprocess
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Install it with: pip install pyyaml --break-system-packages")
    sys.exit(1)

PIPELINE_FILE = Path(__file__).parent / "build.yaml"
DEFAULT_STAGE = "build"


def load_pipeline(path: Path) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def require(command: str, install_hint: str) -> None:
    if shutil.which(command) is None:
        print(f"Error: '{command}' was not found on PATH.")
        print(f"  {install_hint}")
        sys.exit(1)


def run(command: str) -> None:
    args = command.split()
    print(f"  $ {command}")
    result = subprocess.run(args)
    if result.returncode != 0:
        print(f"\nError: '{command}' failed with exit code {result.returncode}.")
        sys.exit(result.returncode)


def run_stage(pipeline: dict, stage_name: str) -> None:
    stages = pipeline.get("stages", {})
    if stage_name not in stages:
        available = ", ".join(stages.keys())
        print(f"Error: stage '{stage_name}' not found in {PIPELINE_FILE}.")
        print(f"  Available stages: {available}")
        sys.exit(1)

    stage = stages[stage_name]
    steps = stage.get("steps") or []

    if not steps:
        print(f"Stage '{stage_name}' has no steps defined. See ROADMAP.md.")
        sys.exit(0)

    description = stage.get("description", stage_name)
    print(f"\n{description}\n")

    for step in steps:
        name = step.get("name", step["command"])
        print(f"[{name}]")
        if "require" in step:
            require(step["require"], step.get("install_hint", f"Install '{step['require']}' and ensure it is on PATH."))
        run(step["command"])
        print()

    print(f"Done — stage '{stage_name}' completed successfully.")


def main() -> None:
    stage = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_STAGE

    if not PIPELINE_FILE.exists():
        print(f"Error: pipeline file not found at {PIPELINE_FILE}")
        sys.exit(1)

    pipeline = load_pipeline(PIPELINE_FILE)
    run_stage(pipeline, stage)


if __name__ == "__main__":
    main()

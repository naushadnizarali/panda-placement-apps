# Define the path to the virtual environment
VENV_DIR=".venv"

# Check if virtual environment exists, if not, create it
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment..."
  python3 -m venv $VENV_DIR
fi

# Activate the virtual environment
source ./$VENV_DIR/bin/activate

# Install requirements
pip install -r requirements.txt

# Deactivate the virtual environment
deactivate

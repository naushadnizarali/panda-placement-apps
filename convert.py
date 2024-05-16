import os


def convert_js_to_jsx(directory):
    # Walk through all directories and subdirectories
    for root, _, files in os.walk(directory):
        for filename in files:
            # Check if the file has a .js extension
            if filename.endswith(".js"):
                # Define the full path for the current file and the new file
                js_file = os.path.join(root, filename)
                jsx_file = os.path.join(root, filename[:-3] + ".jsx")
                # Rename the file
                os.rename(js_file, jsx_file)
                print(f"Renamed: {js_file} to {jsx_file}")


# Specify the directory containing the .js files
directory_path = "/Volumes/Dev/panda-placement-apps/apps/website/src/app/component"
convert_js_to_jsx(directory_path)

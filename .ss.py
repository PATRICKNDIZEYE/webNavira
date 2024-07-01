import os
from datetime import datetime, timedelta

# Define start and end dates
start_date = datetime(2024, 7, 1)
end_date = datetime.now()  # Use today's date

# Loop through all dates from start_date to end_date
current_date = start_date
while current_date <= end_date:
    for hour in range(1, 13):  # Loop through hours
        # Create the commit message
        commit_message = f"{hour} on {current_date.month:02}/{current_date.day:02}/{current_date.year}"

        # Set the commit time
        commit_time = current_date.strftime(f"%Y-%m-%d 12:{hour:02}:00")
        os.environ["GIT_COMMITTER_DATE"] = commit_time
        os.environ["GIT_AUTHOR_DATE"] = commit_time

        # Create commit.md file
        with open("commit.md", "w") as file:
            file.write(commit_message)

        # Run git commands
        os.system("git add commit.md -f")
        os.system(f'git commit --date="{commit_time}" -m "{commit_message}"')

    # Move to the next day
    current_date += timedelta(days=1)


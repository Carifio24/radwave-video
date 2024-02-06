from os import listdir
from os.path import join, splitext
from pandas import read_csv

data_dir = join("..", "data")
for filename in listdir(data_dir):
    path = join(data_dir, filename)
    _, ext = splitext(path)
    if ext != ".csv":
        continue

    df = read_csv(path)
    df.drop("phase", axis=1)
    df.to_csv(path, index=False, lineterminator="\n")

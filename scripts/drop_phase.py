from os import listdir
from os.path import abspath, join, splitext
from pandas import read_csv

data_dir = abspath(join("..", "data"))
for filename in listdir(data_dir):
    path = join(data_dir, filename)
    _, ext = splitext(path)
    print(_, ext)
    if ext != ".csv":
        continue
    print("Continuing")

    df = read_csv(path)
    df.drop("phase", axis=1, inplace=True)
    print(path)
    df.to_csv(path, index=False, lineterminator="\n")

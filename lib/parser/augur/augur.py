from Loader import Loader
from Packet import Packet
import argparse


def main():
    parser = argparse.ArgumentParser(description='Parse quizbowl packets.')
    parser.add_argument("input_file",
                        help="File of packet to be parsed.",
                        type=str)
    parser.add_argument("output_file",
                        nargs='?',
                        help="Name of output dump file. Defaults to input_file + .yml",
                        type=str)
    parser.add_argument("-t", "--tournament",
                        required=True,
                        help="Name of tournament.",
                        type=str)
    parser.add_argument("-r", "--round",
                        required=True,
                        help="Name of round.",
                        type=str)
    parser.add_argument("--num-tossups",
                        help="Number of tossups. Useful if no tossup/bonus demarcator is "
                             "provided, but the number of tossups is known.",
                        type=int)
    parser.add_argument("--tossup-text-re",
                        help="Regex describing the format of tossup question text.",
                        type=str)
    parser.add_argument("--tossup-answer-re",
                        help="Regex describing the format of tossup question answer.",
                        type=str)
    parser.add_argument("--bonus-leadin-re",
                        help="Regex describing the format of bonus leadin.",
                        type=str)
    parser.add_argument("--bonuspart-text-re",
                        help="Regex describing the format of a bonus part text.",
                        type=str)
    parser.add_argument("--bonuspart-answer-re",
                        help="Regex describing the format of a bonus part answer.",
                        type=str)

    args = parser.parse_args()

    print args.tournament


if __name__ == "__main__":
    main()

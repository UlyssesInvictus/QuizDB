from Loader import Loader, LoaderInvalidFormatError
from Packet import Packet

import argparse
import re


def packet_parser(args):
    print("Loading packet into machine readable format....",)
    loader = Loader(args.input_file)
    try:
        load_file = loader.load()
    except LoaderInvalidFormatError as e:
        print('Invalid loader format:', e)
        return
    print("Done!")

    print("Parsing packet %s...." % (args.tournament + " " + args.round),)
    special_args = {}
    special_arg_names = ["num_tossups", "tossup_text_re", "tossup_answer_re",
                         "bonus_leadin_re", "bonuspart_text_re", "bonuspart_answer_re",
                         "strippable_lines_res", "classifier_data_filename"]
    for arg_name in special_arg_names:
        if getattr(args, arg_name):
            arg = getattr(args, arg_name)
            if re.search("_re$", arg_name):
                arg = re.compile(arg, re.I)
            special_args[arg_name] = arg

    packet = Packet(load_file, args.tournament, args.round, **special_args)
    packet.parse_packet()
    print("Done!")

    if packet.is_valid():
        print("Categorizing questions...")
        packet.classify()
        print("Done!")

        print("Outputting questions...")
        output_file = args.output_file if args.output_file else args.input_file + ".yml"

        packet.dump_yaml(output_file)
        print("Done!")
    else:
        print("Invalid packet. Please reformat and try again.")


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
    parser.add_argument("--strippable-lines-res",
                        nargs="*",
                        help="Regices describing lines that can be stripped from input file.",
                        type=str)
    parser.add_argument("--classifier-data-filename",
                        help="Filename of the training data for the classifier.",
                        type=str)

    args = parser.parse_args()
    packet_parser(args)


if __name__ == "__main__":
    main()

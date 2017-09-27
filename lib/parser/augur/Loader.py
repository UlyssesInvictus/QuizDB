import os
import shlex
import subprocess
import re


class LoaderInvalidFormatError(Exception):

    def __init__(self, filename):
        self.filename = filename

    def __str__(self):
        return '\nInvalid loader format for {}!'.format(self.filename)


class Loader:

    def __init__(self, filename):
        self.filename = filename

    def load_doc(self):
        if re.search('docx', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        elif re.search('doc', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        else:
            raise LoaderInvalidFormatError(self.filename)

        cmd = 'pandoc -f docx -t html -o "{0}" "{1}"'.format(html_file, self.filename)
        cmd = shlex.split(cmd)

        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, errors = p.communicate()

        print output
        print errors

        return html_file

    # intentionally not supported (for now), because PDF files are very finicky
    # def load_pdf(self):
        # pdf_file = os.path.abspath(self.filename)
        #
        # if re.search('pdf', pdf_file):
        #     html_file = pdf_file.replace('.pdf', '.html')
        # else:
        #     raise LoaderInvalidFormatError(self.filename)
        #
        # # with open(html_file, "w") as f:
        # #     f.write("")
        #
        # # cmd = 'pdf2htmlEX "{0}" "{1}"'.format(pdf_file, html_file)
        # cmd = 'pdf2htmlEX "{0}"'.format(pdf_file)
        # cmd += " --process-nontext 0"
        # cmd += " --process-outline 0"
        # cmd += " --embed-external-font 0"
        # cmd = shlex.split(cmd)
        #
        # p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # output, errors = p.communicate()
        #
        # print output
        # print errors
        #
        # return html_file

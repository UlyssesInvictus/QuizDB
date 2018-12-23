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

    def load(self):
        if (re.search('docx$', self.filename) or re.search('doc$', self.filename)):
            return self.load_doc()
        elif (re.search('txt$', self.filename) or re.search('html$', self.filename)):
            return self.filename
        else:
            raise LoaderInvalidFormatError(self.filename)

    def load_doc(self):
        if re.search('docx$', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        elif re.search('doc$', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        else:
            raise LoaderInvalidFormatError(self.filename)

        cmd = 'pandoc -f docx -t html5 -o "{0}" "{1}"'.format(html_file, self.filename)
        cmd = shlex.split(cmd)

        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, errors = p.communicate()

        if (output):
            print('Output:', output)
        if (errors):
            print('Errors:', errors)

        # hack to fix the issue where pandoc has no native underline element
        # we have to make an educate guess that the only case where there would
        # be a bold AND an italic is when it's actually supposed to be underline
        # in the answerline -- this produces some false positives, but is generall
        # a good approach since bolds almost always only appear in answerlines
        with open(html_file, 'r+') as f:
            text = f.read()
            text = re.sub("<strong><em>", "<strong><u>", text)
            text = re.sub("</em></strong>", "</u></strong>", text)
            # less accurate, but still catches some cases
            text = re.sub("prompt on <em>(.*?)</em>", "prompt on <u>\\1</u>", text)
            f.seek(0)
            f.write(text)
            f.truncate()

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

import os
import shlex
import subprocess
import codecs
import re


class Loader:

    def __init__(self, filename):
        self.filename = filename

    def load_doc(self):
        if re.search('docx', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        elif re.search('doc', self.filename):
            html_file = self.filename.replace('.docx', '.html')
        else:
            print("not valid input format")

        cmd = 'pandoc -f docx -t html -o "{0}" "{1}"'.format(html_file, self.filename)
        cmd = shlex.split(cmd)

        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, errors = p.communicate()

        print output
        print errors

        return html_file

    def load_pdf(self):
        pdf_file = os.path.abspath(self.filename)

        if re.search('pdf', doc_file):
            html_file = doc_file.replace('.pdf', '.html')
        else:
            print("not valid input format")

        cmd = 'pandoc -f pdf -t html -o "{0}" "{1}"'.format(html_file, pdf_file)
        cmd = shlex.split(cmd)

        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, errors = p.communicate()

        print output
        print errors

        return html_file

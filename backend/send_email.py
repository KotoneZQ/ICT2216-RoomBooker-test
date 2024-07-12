import ssl
from smtplib import SMTP_SSL
from email.message import EmailMessage
from dotenv import load_dotenv
import os
load_dotenv()
port = 465  # For SSL
smtp_server = "smtp.gmail.com"
sender_email = os.environ.get('admin_email')
password = os.environ.get('admin_password')
otp = ""
verify_link = ""
# HTML message template with a placeholder for the OTP
verify_html_message_template = """
    <html>
    <head>
        <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            width:780px;
        }}
        .container {{
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }}
        .header_container{{
            background-color: #ec8f7f;
            text-align:center;
        }}
        h1 {{
            color: #444;
        }}
        p {{
            line-height: 1.6;
        }}
        a {{
            color: #1a73e8;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header_container">
                <h1>Do nothing if you did not request for this.</h1>
            </div>
            <div class="body">
                <p>To verify your account, please use the following link:</p>
                <h3><a href="{link}">Verify Now</a></h3>
                <br>
                <p>We hope to see you again soon.</p>
            </div>
        </div>
    </body>
    </html>
    """

otp_html_message_template = """
    <html>
    <head>
        <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            width:780px;
        }}
        .container {{
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }}
        .header_container{{
            background-color: #ec8f7f;
            text-align:center;
        }}
        h1 {{
            color: #444;
        }}
        p {{
            line-height: 1.6;
        }}
        a {{
            color: #1a73e8;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header_container">
                <h1>Do nothing if you did not request for this.</h1>
            </div>
            <div class="body">
                <p>To authenticate, please use the following One Time Password (OTP):</p>
                <h3>{otp}</h3>
                <br>
                <p>Don't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card, or banking info.</p>
                <br>
                <p>We hope to see you again soon.</p>
            </div>
        </div>
    </body>
    </html>
    """
# <h3>Do you want to find hot guys in your area? Click <a href="https://t.me/hargaowithchili">here</a></h3>
verify_message_template = """
    Do nothing if you did not request for this.
    To verify your account, please use the following link:
    {link}
    We hope to see you again soon.
    """
otp_message_template = """
    Do nothing if you did not request for this.
    Please use the following One Time Password (OTP):
    {otp}
    Do not share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card, or banking info.
    We hope to see you again soon.
    """


def send_email_to_verify(to_email: str, verify_link: str, purpose: str = ""):
    subject = "Account Verification"

    html_message = verify_html_message_template.format(link=verify_link)
    message = verify_message_template.format(link=verify_link)

    em = EmailMessage()
    em['From'] = sender_email
    em['To'] = to_email
    em['Subject'] = subject

    em.set_content(message)
    em.add_alternative(html_message, subtype='html')

    context = ssl.create_default_context()
    with SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, to_email, em.as_string())


def send_email_to_otp(to_email: str, otp: str, purpose: str = ""):
    subject = "OTP Verification"

    html_message = otp_html_message_template.format(otp=otp)
    message = otp_message_template.format(otp=otp)

    em = EmailMessage()
    em['From'] = sender_email
    em['To'] = to_email
    em['Subject'] = subject

    em.set_content(message)
    em.add_alternative(html_message, subtype='html')

    context = ssl.create_default_context()
    with SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, to_email, em.as_string())

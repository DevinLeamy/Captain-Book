package server.libgen.kindle

import com.sendgrid.Method
import com.sendgrid.Request
import com.sendgrid.SendGrid
import com.sendgrid.helpers.mail.Mail
import com.sendgrid.helpers.mail.objects.Attachments
import com.sendgrid.helpers.mail.objects.Content
import com.sendgrid.helpers.mail.objects.Email
import server.utils.extensionToMimeType
import java.io.File
import java.util.Base64



class MailClient {
    private val sendgrid = SendGrid(System.getenv("SENDGRID_API_KEY"))

    fun sendEmail(mail: Mail): Result<Unit> {
        val request = Request().apply {
            method = Method.POST
            endpoint = "mail/send"
            body = mail.build()
        }
        val response = sendgrid.api(request)
        val success = response.statusCode == 202

        return if (success) {
            Result.success(Unit)
        } else {
            Result.failure(Exception("Failed to send email ${response.headers}"))
        }
    }
}

class KindleAPI {
    private val mailClient = MailClient()

    private fun encodeFileBase64(file: File): String {
        return Base64.getEncoder().encodeToString(file.readBytes())
    }
    /**
     * Sends the given book to the given email address.
     *
     * See: https://stackoverflow.com/questions/38599079/sendgrid-emailing-api-send-email-attachment
     */
    fun sendToKindle(email: String, book: File): Result<Unit> {
        val from = Email("captainbook.kindlegmail.com")
        val to = Email(email)
        val subject = "Book"
        val attachments = Attachments()
        attachments.type = extensionToMimeType[book.extension.lowercase()]!!
        attachments.content = encodeFileBase64(book)
        attachments.disposition = "attachment"
        attachments.filename = "book.${book.extension}"

        val mail = Mail(from, subject, to, Content("text/plain", "EBook."))
        mail.addAttachments(attachments)

        return mailClient.sendEmail(mail)
    }
}
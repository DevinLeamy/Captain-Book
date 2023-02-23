package server.kindle

import com.sendgrid.Method
import com.sendgrid.Request
import com.sendgrid.SendGrid
import com.sendgrid.helpers.mail.Mail
import com.sendgrid.helpers.mail.objects.Attachments
import com.sendgrid.helpers.mail.objects.Content
import com.sendgrid.helpers.mail.objects.Email
import java.io.File
import java.util.Base64

val extensionToMimeType = mapOf(
    "pdf" to "application/pdf",
    "epub" to "application/epub+zip",
    "mobi" to "application/x-mobipocket-ebook"
)

class MailClient {
    private val sendgrid = SendGrid(System.getenv("SENDGRID_API_KEY"))

    fun sendEmail(mail: Mail) {
        val request = Request().apply {
            method = Method.POST
            endpoint = "mail/send"
            body = mail.build()
        }
        val response = sendgrid.api(request)
        println(response.statusCode)
        println(response.body)
        println(response.headers)
    }
}

class KindleAPI {
    val mailClient = MailClient()

    private fun encodeFileBase64(file: File): String {
        return Base64.getMimeEncoder().encodeToString(file.readBytes())
    }
    /**
     * Sends the given book to the given email address.
     *
     * See: https://stackoverflow.com/questions/38599079/sendgrid-emailing-api-send-email-attachment
     */
    suspend fun sendToKindle(email: String, book: File) {
        val from = Email("devinleamy@gmail.com")
        val to = Email("devinleamy@gmail.com")
        val subject = "Book"
//        val attachments = Attachments()
//        attachments.type = extensionToMimeType[book.extension]!!
//        attachments.content = encodeFileBase64(book)
//        attachments.disposition = "attachment"
//        attachments.filename = "book.${book.extension}"

        val mail = Mail(from, subject, to, Content("text/plain", "EBook."))
//        mail.addAttachments(attachments)

        mailClient.sendEmail(mail)
    }
}
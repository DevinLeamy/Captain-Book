package server.db

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.GetObjectRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.sdk.kotlin.services.s3.presigners.presign
import aws.smithy.kotlin.runtime.content.asByteStream
import server.utils.extensionToMimeType
import java.io.File
import java.util.*
import kotlin.time.Duration.Companion.seconds

/**
 * Temporary: Will be replaced once I have a better grasp of how to interact with
 * objects stores in an S3 bucket.
 */

object S3 {
    private const val BUCKET_NAME = "nouvelle-bucket"
    private const val REGION = "us-east-1"

    private suspend fun putFile(file: File, metadata: MutableMap<String, String>): String {
        /**
         * TODO: I was receiving a credential error, when I had a single
         * S3Client property that. Having one client would be ideal, because then
         * we're not reinitializing the client on every request.
         */
        val client = S3Client {
            region = REGION
        }
        val key = UUID.randomUUID().toString() + file.name

        val request = PutObjectRequest {
            bucket = BUCKET_NAME
            this.key = key
            this.metadata = metadata
            body = file.asByteStream()
            contentType = extensionToMimeType[file.extension]
        }

        client.use { s3 ->
             s3.putObject(request)
        }

        return key
    }

    suspend fun putImage(file: File): String {
        val metadata = mutableMapOf<String, String>()
        metadata["name"] = file.nameWithoutExtension
        metadata["extension"] = file.extension
        return putFile(file, metadata)
    }
    suspend fun putBook(file: File): String {
        val metadata = mutableMapOf<String, String>()
        metadata["name"] = file.nameWithoutExtension
        metadata["extension"] = file.extension
        return putFile(file, metadata)
    }

    /**
     * Generate a pre-signed URL for a given object, like an image.
     */

    suspend fun generatePresignedUrl(key: String): String {
        val getObjectRequest = GetObjectRequest {
            bucket = BUCKET_NAME
            this.key = key
        }
        val getObjectPresignRequest = getObjectRequest.presign(
            S3Client.Config { region = REGION },
            3600.seconds
        )
        return getObjectPresignRequest.url.toString()
    }
}

Documentación
Referencia de API

español (México)
REST-JSON
NVP
Version
100 (latest)
Introduction
Agreement
Authentication
Batch
Browser Payment
Gateway
Hosted Checkout
Payment Plan
Session
Standalone Risk Assessment
Tokenization
Transaction
Wallet
SDKS
Checkout
Click to Pay
Paypal
Risk
Rupay
Session
ThreeDS
RESOURCES
Changelog
Versioning
Gateway API Reference Documentation
Ready to redefine your payment experience? Join Gateway today and unlock a world where getting paid is not a hurdle but a seamless, simple process.

From API version 100, integrations must be able to handle non-breaking changes. Any API References for deprecated versions are hidden. For information on all API versions, see our changelog.

Understanding the Gateway API
Whether you're a coding maestro or just starting out, our intuitive interface and robust API have been meticulously crafted to ensure that integrating payments into your applications is not only efficient but downright enjoyable.

Agreement
Allows the merchant to store the payer's payment details and make payments under that agreement without the payer's involvement.

View Documentation >
Authentication
Authentication process to confirm the identity of the payer attempting to make a transaction.

View Documentation >
Batch
Submit batches of operations (Captures, Refunds, etc) to the Gateway for processing without direct payer interaction.

View Documentation >
Browser Payment
Browser payment methods allow a payer to pay for goods and services online on the browser payment provider's website.

View Documentation >
Gateway
Operations related to speaking directly to the Gateway for status or payment option related details.

View Documentation >
Hosted Checkout
Request to initiate a Hosted Checkout interaction.

View Documentation >
Payment Plan
Request to retrieve a set of payment plan offers for a payment plan so that they can be presented to the cardholder.

View Documentation >
Session
A payment session, or simply session, is a temporary container for any request fields and values of operations that reference a session.

View Documentation >
Standalone Risk Assessment
Standalone risk assessment is for routing a card transaction to a risk service provider for risk assessment without processing a payment.

View Documentation >
Tokenization
The identifier for the stored card details that may be used for later to refer to the card details to perform a payment or authorization.

View Documentation >
Transaction
Represents a request by a merchant to transfer money (or to prepare for the transfer) between a payer's account and the merchant's account (or vice versa).

View Documentation >
Wallet
An electronic service that allows payers to securely store payment details (e.g. credit card details).

View Documentation >
SDKs
Checkout
The JavaScript library allows simple payment integrations for merchant sites.

Learn more
Click to Pay
The JavaScript library allows you to add support for Click to Pay to your payment page.

Learn more
Paypal
A JavaScript based, client-side SDK for PayPal payments.

Learn more
Risk
JavaScript based client-side SDK for integration with NuDetect risk assessment platform.

Learn more
Rupay
JavaScript based client-side SDK for Rupay authentication flows for online payments.

Learn more
Session
The JavaScript library allows you to collect sensitive payment details from the payer in fields hosted by the gateway.

Learn more
ThreeDS
A JavaScript based client-side SDK for 3DS authentication flows for online payments.

Learn more
Resources

Descargas
Glosario
FAQs
Derechos de autor © 2026 Mastercard




Retrieve Agreement
Request to retrieve the details stored in the gateway of an agreement between the merchant and a cardholder.

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
agreement
/
{agreementId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{agreementId}
String
REQUIRED
Your identifier for the agreement you have with the payer to process payments.


Data can consist of any characters

Min length: 1 Max length: 100
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
agreement.status
Enumeration
ALWAYS PROVIDED
The status of the agreement (ACTIVE or CANCELLED) as per the issuer or a third-party provider that maintains the agreements.

The gateway obtains/refreshes the status of the agreement when.

You submit a request to the gateway to authorize or cancel an agreement (the gateway passes this information to the regulator/third-party provider)
OR

Your acquirer updates the gateway when the payer has directly cancelled the agreement with their issuing bank.
For all other integrations, the value will be set to UNKNOWN_IN_VERSION.

Value must be a member of the following list. The values are case sensitive.

ACTIVE
The agreement has been registered and is active.

CANCELLED
The agreement is no longer active. It has been cancelled by either you or the payer.

UNKNOWN_IN_VERSION
The status of the agreement is UNKNOWN_IN_VERSION.

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Request to authenticate a payer, i.e. verify the identity of a cardholder. You can subsequently use the resulting authentication data when submitting a financial transaction request to prove that you have performed payer authentication.

You must first invoke the Initiate Authentication operation and where the response indicates that payer authentication is available, you must then invoke the Authenticate Payer operation with the same orderId and transactionId submitted on the Initiate Authentication operation.

To increase the likelihood of the authentication being successful, provide as much information about the payer and the transaction as possible.

If the information in the request is sufficient to allow the authentication scheme to confirm the payer's identity the response will include the authentication data (frictionless flow). Alternatively (challenge flow), it may be necessary for the payer to interact with the authentication scheme to confirm their identity (e.g. by providing a one-time password sent to them by their card issuer). In this case the response will contain an HTML excerpt that you must inject into your page. This will establish the interaction between the payer and the authentication scheme. After authentication has been completed the payer will be redirected back to your website using the URL provided by you in field authentication.redirectResponseUrl in the Authenticate Payer request.

If you are authenticating the payer when establishing a payment agreement with your payer for a series of recurring, installment or unscheduled payments you must provide details about the agreement in the agreement parameter group.

Usage Note

Using the Initiate Authenticate and Authenticate Payer operations for 3-D Secure authentication requires you to manage a variety of authentication flows and understand the 3-D Secure version 2 data flows as published by EMVCo.

A more simple alternatively is to use the gateway's threeDS.js library.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= AUTHENTICATE_PAYER
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.netAmount
Decimal
OPTIONAL
The amount payable for the order before merchant charge amount is applied.

If you specify a net amount the gateway will calculate the merchant charge amount for you based on the charge type (order.merchantCharge.type) provided in the request. Alternatively, you can specify the merchant charge amount (order.merchantCharge.amount) yourself.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Initiate Authentication
Request returning which payer authentication mechanism (e.g. 3-D Secure authentication version 2, 3-D Secure authentication version 1, RuPay PaySecure) the gateway recommends you to use for this order.

Where both 3-D Secure Authentication version 1 and version 2 are available the gateway returns 3-D Secure authentication version 2.

You must provide details about the card, the purpose of the authentication (e.g payment or card registration only), and how the payer will interact with the authentication process (e.g. via the browser or mobile app).

You can provide the actual card details, or a gateway token, scheme token or device payment details.

The response will indicate, if payer authentication is available. You can either
only proceed with the Authenticate Payer operation where the response indicates that payer authentication is available (transaction.authenticationStatus=AUTHENTICATION_AVAILABLE ) or
(to simplify your integration) always proceed with the Authenticate Payer operation. Where no payer authentication is available, the payer will simply be redirected back to your website.
When performing payer authentication we recommend you use a payment session. This will allow you to share the request data across the multiple operations required to carry out both the payer authentication and transaction processing.

When using a payment session build your integration as follows:
When you create the payment session, populate it with all the transaction data required for the Authenticate Payer operation.
As soon as you have the card number, invoke the Initiate Authentication operation with the payment session identifier. It is recommended that you perform this asynchronously, so that the payer can continue filling out payment details.
When the payers clicks PAY, update the payment session with the additional data entered by the payer and invoke the Authenticate Payer operation with the payment session identifier.
On your website, receive the POST callback from the gateway following the Authenticate Payer operation and submit the payment for processing by the gateway with the payment session identifier.
Usage Note

Using the Initiate Authenticate and Authenticate Payer operations for 3-D Secure authentication requires you to manage a variety of authentication flows and understand the 3-D Secure version 2 data flows as published by EMVCo.

A more simple alternatively is to use the gateway's threeDS.js library.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= INITIATE_AUTHENTICATION
FIXED
Any sequence of zero or more unicode characters.

order.currency
Upper case alphabetic text
REQUIRED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Close Batch
Request to manually initiate closure of the acquirer batch.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
batch
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
acquirer
REQUIRED
Information on acquirer fields required to determine which acquirer link closes the batch.

Response
Fields
Show conditional fields 
acquirer.id
ASCII Text
ALWAYS PROVIDED
The identifier of the acquirer used to perform the batch closure.

Data consists of ASCII characters

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Request to execute a successfully initiated browser payment where the payment has been agreed by the payer. If you have chosen that the payer must confirm the payment on your website then, you may modify some of the details regarding the payment, including the amount and line item details but not the currency.
You must submit the same transaction ID as when initiating the payment.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= CONFIRM_BROWSER_PAYMENT
FIXED
Any sequence of zero or more unicode characters.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Request to initiate a browser payment. You must use the URL provided in the response to redirect the payer's browser to the browser payment provider's website.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= INITIATE_BROWSER_PAYMENT
FIXED
Any sequence of zero or more unicode characters.

browserPayment
REQUIRED
Information used to manage interactions with the payment provider if you are offering your payment page on a website or are redirecting the payer's browser to the provider's website.

If you are offering your payment page in an app or are redirecting the payer to the provider's app, use the appPayment parameter group.

browserPayment.operation
Enumeration
REQUIRED
The type of transaction you want to create for this payment.For a successful Authorization transaction, you must submit a CAPTURE request to move the funds from the payer's account to your account.

Value must be a member of the following list. The values are case sensitive.

ACCOUNTSETUP
The transaction created in the gateway is an ACCOUNT SETUP transaction.

AUTHORIZE
The transaction created in the gateway is an AUTHORIZATION transaction.

PAY
The transaction created in the gateway is a PAYMENT transaction.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
REQUIRED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

sourceOfFunds.type
Enumeration
REQUIRED
The payment method used for this payment.

If you are passing card data (in any form) on the API, then you need to set this value, and also provide the card details in the sourceOfFunds.provided.card group. In the case of digital wallets or device payment methods, you must also populate the order.walletProvider field.

If you are making a payment with a gateway token, then you can leave this field unset, and only populate the sourceOfFunds.token field. However you can set this to CARD if you want to overwrite or augment the token data with a card security code, expiry date, or cardholder name.

Value must be a member of the following list. The values are case sensitive.

ALIPAY
The payer selected the payment method Alipay.

BANCONTACT
The payer selected the payment method Bancontact.

BLIK
The payer selected the payment method BLIK.

BOLETO_BANCARIO
The payer selected the payment method Boleto Bancario.

BROWSER_PAYMENT
The payer selected to pay using a browser payment. Refer to the sourceOfFunds.browserPayment parameter group for additional details.

ENETS
The payer selected the payment method eNETS.

EPS_UEBERWEISUNG
The payer selected the payment method eps-Überweisung.

GIROPAY
The payer selected the payment method giropay.

GRABPAY
The payer selected the payment method GrabPay.

IDEAL
The payer selected the payment method iDEAL.

KLARNA_FINANCING
The payer selected the payment method Klarna financing.

KLARNA_PAY_LATER
The payer selected the payment method Klarna Pay Later.

KLARNA_PAY_NOW
The payer selected the payment method Klarna Pay Now.

MERCADO_PAGO_CHECKOUT
The payer selected the payment method Mercado Pago Checkout.

MULTIBANCO
The payer selected the payment method Multibanco.

OPEN_BANKING_BANK_TRANSFER
The payer selected the payment method Open Banking Bank Transfer.

OXXO
The payer selected the payment method OXXO.

PAYCONIQ
The payer selected the payment method payconiq.

PAYPAL
The payer selected the payment method PayPal.

PAYSAFECARD
The payer selected the payment method paysafecard.

PAYU
The payer selected the payment method PayU.

POLI
The payer selected the payment method POLi.

PRZELEWY24
The payer selected the payment method Przelewy24.

SEPA
The payer selected the payment method SEPA.

SOFORT
The payer selected the payment method Sofortbanking.

TRUSTLY
The payer selected the payment method Trustly.

UNION_PAY
The payer selected the payment method UnionPay.

WECHAT_PAY
The payer selected the payment method WeChatPay.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Request to retrieve updated details of a browser payment transaction from the payment provider before you request the payment provider to process the payment. For PayPal payments, use this operation to determine if the payer changed the shipping address or if the payer agreed to the payment.
You must submit the same transaction ID as when initiating the payment.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= UPDATE_BROWSER_PAYMENT
FIXED
Any sequence of zero or more unicode characters.

correlationId
String
OPTIONAL
A transient identifier for the request, that can be used to match the response to the request.

The value provided is not validated, does not persist in the gateway, and is returned as provided in the response to the request.

Data can consist of any characters

Min length: 1 Max length: 100
session.id
ASCII Text
OPTIONAL
Identifier of the payment session containing values for any of the request fields to be used in this operation.

Values provided in the request will override values contained in the session.

Data consists of ASCII characters

Min length: 31 Max length: 35
session.version
ASCII Text
OPTIONAL
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

If session.version provided by you does not match that stored against the session, the gateway will reject the operation with error.cause=INVALID_REQUEST.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Check Gateway
Request to check that the gateway is operating.

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
information
Authentication
None required.
Request
Fields
There are no fields for this operation.

Response
Fields
gatewayVersion
ASCII Text
ALWAYS PROVIDED
Identifies the current version of the gateway platform.

Data consists of ASCII characters

Min length: 5 Max length: 32
status
Enumeration
ALWAYS PROVIDED
Indication of the ability of the gateway to process requests.

Summarizes the ability of the gateway to perform operations.

Value must be a member of the following list. The values are case sensitive.

OPERATING
The service is currently capable of processing requests.

SHUTDOWN
The service is currently not accepting requests.

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Create Payment Instrument Reference Id
Use this operation to request a unique payment instrument identifier associated to payer payment credentials.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
createPaymentInstrumentReferenceId
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= CREATE_PAYMENT_INSTRUMENT_REFERENCE_ID
FIXED
Any sequence of zero or more unicode characters.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, token service provider, acquirer or issuer

SUCCESS
The operation was successfully processed

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Payment Options Inquiry
Request to retrieve the payment options you can present to the payer, for example, the available payment methods and card types.
The returned options depend on your merchant profile configuration in the gateway and your input.For example, when you provide the order currency in the request, the response only contains payment options that are available for orders with this currency.

If you do not provide any input parameters, all values that could apply for all fields are returned: all of the possible card types, all of the possible currencies, and so on.

Depending on your configuration and the input parameters the response may also contain
a rate quote for Dynamic Currency Conversion.
the applicable Surcharge for the order.
the applicable Payment Plan Offers for the cart or the order.

Usage Note

You may not need to use this operation if your merchant profile configuration rarely changes and therefore the available payment options can be hard-coded into your website.

However, the operation will allow you to build the presentation and input validation for your checkout process in a dynamic way. As you are collecting more details from the payer during the checkout process, the operation tells you what fields to collect and what validation to apply.

If you have a simple configuration (for example, only accept a list of card types for s single currency), you can use the unmodified data set returned if the request is called without any input parameters for building the website's presentation and input validation.

If you have a more complex configuration (for example, accept USD and EUR currencies on Mastercard and Visa, but only USD on American Express), call the operation with parameters to restrict the returned values. For example:

If a sourceOfFunds.provided.card.prefix is passed in, only currencies applicable to the card brand identified based on this prefix are returned.
If an order.currency is passed in, only payment options applicable for that currency are returned.
Warning This operation must not be called directly from the browser, as it would expose your API integration password.


POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
paymentOptionsInquiry
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the transaction/operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Initiate Checkout
Request to initiate a Hosted Checkout interaction, i.e. a Hosted Payment Page or Embedded Page interaction that allows the payer to select their payment details and make the payment. See Implementing a Hosted Checkout Integration for details.

The gateway returns a session identifier (session.id) that you must include in the Checkout.configure() function.
The gateway automatically expires the session.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= INITIATE_CHECKOUT
FIXED
Any sequence of zero or more unicode characters.

interaction
REQUIRED
Information that controls the payer's checkout interaction.

interaction.operation
Enumeration
REQUIRED
Indicates the operation that you wish to perform during the Hosted Checkout interaction.

Value must be a member of the following list. The values are case sensitive.

AUTHORIZE
Request for the Hosted checkout interaction to create Authorization transaction for the payment.

NONE
Hosted Checkout will collect the payment details from the payer and securely store them against the Hosted Checkout session. No operation will be performed after the payer interaction.

PURCHASE
Request for the Hosted checkout interaction to create Purchase transaction for the payment.

VERIFY
Request for the Hosted Checkout interaction to verify the payer's account. The payment details are verified using the verification method supported by the acquirer and the data provided in the request.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.netAmount
Decimal
OPTIONAL
The amount payable for the order before surcharging is applied.

If you specify a net amount the gateway will calculate the surcharge for you.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.id
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
Response
Fields
Show conditional fields 
checkoutMode
Enumeration
ALWAYS PROVIDED
Defines how the Hosted Checkout interaction can be launched.

If you want to immediately redirect the payer from your website (Hosted Payment Page) or launch the Lightbox to make the payment, set this value to WEBSITE. This is the default behavior if the field is not provided.


Value must be a member of the following list. The values are case sensitive.

WEBSITE
Returns a session identifier (session.id) that you need to pass when configuring the Hosted Checkout interaction using the Checkout.configure() function. This is the default value.

merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the transaction/operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

successIndicator
ASCII Text
ALWAYS PROVIDED
An identifier to determine the success of the hosted payment.

The gateway will return this value in the resultIndicator parameter (appended to the returnUrl) for successful payments only. See Obtain the Payment Result section.

Data consists of ASCII characters

Min length: 16 Max length: 32
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Documentación
Referencia de API

español (México)
REST-JSON
NVP
Version
100 (latest)
Back
Payment Plan
PUT
Plan Offers Inquiry

Plan Offers Inquiry
Request to retrieve a set of payment plan offers for a payment plan so that they can be presented to the cardholder. After the cardholder has selected one of the payment plan offers, the merchant requests a Pay or Authorize transaction that includes the number of payments selected by the cardholder. The Plan Offers Inquiry operation is applicable to AMEX_PlanAmex plan type only, where the merchant is paid in full less applicable discount rate; and the cardholder is billed in installments plus the applicable interest rate. It is used for Plan Amex transactions in Brazil to satisfy statutory requirements where the merchant must provide the cardholder with information about the amount of interest charged

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
paymentPlan
/
{planId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{planId}
String
REQUIRED
The identifier for the payment plan.


See Payment Plans for the supported payment plans and their identifiers.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= PLAN_OFFERS_INQUIRY
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
REQUIRED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
paymentPlan.numberOfPayments
Digits
REQUIRED
The number of monthly payments payable by the cardholder.

Data is a number between 1 and 99 represented as a string.

sourceOfFunds
REQUIRED
The details describing the source of the funds to be used.

For card payments these may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
correlationId
String
CONDITIONAL
A transient identifier for the request, that can be used to match the response to the request.

The value provided is not validated, does not persist in the gateway, and is returned as provided in the response to the request.

Data can consist of any characters

Min length: 1 Max length: 100
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
paymentPlan
ALWAYS PROVIDED
Information about the payment plan including interest rate and the available payment plan offers.

paymentPlan.interestRate
Decimal
CONDITIONAL
The interest rate applied to the purchase amount for this plan.

Data is a decimal number.

Max value: 100 Min value: 0
paymentPlan.planId
String
ALWAYS PROVIDED
The identifier for the payment plan.

See Payment Plans for the supported payment plans and their identifiers.

Data can consist of any characters

Min length: 1 Max length: 40
paymentPlan.planOffer[n]
ALWAYS PROVIDED
Information about the available payment plan offers.

For AMEX_PlanAmex plan type, up to 5 offers will be returned based on the requested number of payments. The response includes offer for the requested number of payments, as well as for 2 more and 2 less number of payments.

paymentPlan.planOffer[n].finalAmount
Decimal
ALWAYS PROVIDED
The total amount payable by the cardholder, including interest for this plan.

The amount is expressed as a decimal number in the units of the currency. For example 12.34 in USD is the amount 12 dollars and 34 cents

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
paymentPlan.planOffer[n].numberOfPayments
Integer
ALWAYS PROVIDED
The number of monthly payments payable by the cardholder.

JSON number data type, restricted to being positive or zero. In addition, the represented number may have no fractional part.

Min value: 1 Max value: 99
paymentPlan.planOffer[n].paymentAmount
Decimal
ALWAYS PROVIDED
The value of each monthly payment for this payment plan offer.

The amount is expressed as a decimal number in the units of the currency. For example 12.34 in USD is the amount 12 dollars and 34 cents.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the proposed operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. You can handle the transaction as a declined transaction. Where possible the gateway will attempt to reverse the transaction.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

sourceOfFunds
ALWAYS PROVIDED
Details about the source of the funds for this payment.

sourceOfFunds.provided
ALWAYS PROVIDED
The details of the source of funds when they are directly provided as opposed to via a token or session.

sourceOfFunds.provided.card
ALWAYS PROVIDED
Details as shown on the card.

sourceOfFunds.provided.card.expiry
CONDITIONAL
Expiry date, as shown on the card.

sourceOfFunds.provided.card.expiry.month
Digits
ALWAYS PROVIDED
Month, as shown on the card.

Months are numbered January=1, through to December=12.

Data is a number between 1 and 12 represented as a string.

sourceOfFunds.provided.card.expiry.year
Digits
ALWAYS PROVIDED
Year, as shown on the card.

The Common Era year is 2000 plus this value.

Data is a string that consists of the characters 0-9.

Min length: 2 Max length: 2
sourceOfFunds.provided.card.number
Masked digits
ALWAYS PROVIDED
The account number embossed onto the card.

By default, the card number will be returned in 6.4 masking format, for example, 000000xxxxxx0000.If your masking format settings is other than 6.4, then the card number will be masked as per your settings.If you wish to return unmasked card numbers, you must have the requisite permission, set responseControls.sensitiveData field to UNMASK, and authenticate your call to the API using certificate authentication.

Data is a string that consists of the characters 0-9, plus 'x' for masking

Min length: 9 Max length: 19
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

En esta página
Authentication
Request: URL Parameters
Request: Fields
Response: Fields
Response: Errors
Resources

Descargas
Glosario
FAQs
Derechos de autor © 2026 Mastercard

Create Session
Request to create a payment session. A payment session can be used to temporarily store any of the request fields of operations that allow a session identifier as a request field.
The request fields stored in the session may then be used in these operations by providing the session identifier. They may be updated and obtained using the Update Session and Retrieve Session operation respectively.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the transaction/operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

session.aes256Key
ASCII Text
ALWAYS PROVIDED
The key you can use to decrypt sensitive data passed to your website via the payers's browser or mobile device.

For some gateway operations invoked via a payer device, you supply your website as a return URL.

On return to your website, the gateway will encrypt sensitive data using this symmetric key. Most integrations do not need that sensitive data, and can ignore this parameter.

This is a Base64 encoded AES256 key, generated uniquely for this session.

This key should never be exposed to the payer environment.

Data consists of ASCII characters

Min length: 44 Max length: 44
session.authenticationLimit
Integer
ALWAYS PROVIDED
The number of operations which may be submitted to the gateway using this session id as a password.

This field applies when you write a browser or mobile app that issues operations to the gateway from the device, using the session id as a password.

In that case, a payer (or a compromised browser), could issue a large number of requests to the gateway on your behalf, and you could incur unnecessary fees as a result.

This field lets you limit your exposure to that risk. The value defaulted by the gateway is suitable for typical payments. There is an upper limit (your operation will be rejected if that limit is exceeded).

JSON number data type, restricted to being positive or zero. In addition, the represented number may have no fractional part.

Min value: 0 Max value: 9999
session.id
ASCII Text
ALWAYS PROVIDED
The identifier for the payment session.

You can add request fields to the session using a Hosted Payment Form or wallet provider interaction, or the Update Session operation.

Data consists of ASCII characters

Min length: 31 Max length: 35
session.updateStatus
Enumeration
ALWAYS PROVIDED
A summary of the outcome of the last attempt to modify the session.

In order to perform an operation using this session this value must be SUCCESS.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The last attempt to place data into the session was unsuccessful. The session may contain invalid data. A request operation using this session will be rejected by the payment gateway.

NO_UPDATE
No attempt has been made to place data into the session. A request operation using this session will be rejected by the payment gateway.

SUCCESS
The last attempt to update the session was successful. You may submit a request operation using this session.

session.version
ASCII Text
ALWAYS PROVIDED
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Retrieve Session
Request to obtain the request fields contained in the session

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
/
{sessionId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{sessionId}
ASCII Text
REQUIRED
The identifier of the payment session


Data consists of ASCII characters

Min length: 31 Max length: 35
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
session
ALWAYS PROVIDED
Session Information

session.id
ASCII Text
ALWAYS PROVIDED
The identifier of the session

Data consists of ASCII characters

Min length: 31 Max length: 35
session.updateStatus
Enumeration
ALWAYS PROVIDED
A summary of the outcome of the last attempt to modify the session.

In order to perform an operation using this session this value must be SUCCESS.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The last attempt to place data into the session was unsuccessful. The session may contain invalid data. A request operation using this session will be rejected by the payment gateway.

NO_UPDATE
No attempt has been made to place data into the session. A request operation using this session will be rejected by the payment gateway.

SUCCESS
The last attempt to update the session was successful. You may submit a request operation using this session.

session.version
ASCII Text
ALWAYS PROVIDED
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Update Session
Request to add or update request fields contained in the session.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
/
{sessionId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{sessionId}
ASCII Text
REQUIRED
The identifier of the payment session


Data consists of ASCII characters

Min length: 31 Max length: 35
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
session
ALWAYS PROVIDED
Session Information

session.id
ASCII Text
ALWAYS PROVIDED
The identifier of the session

Data consists of ASCII characters

Min length: 31 Max length: 35
session.updateStatus
Enumeration
ALWAYS PROVIDED
A summary of the outcome of the last attempt to modify the session.

In order to perform an operation using this session this value must be SUCCESS.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The last attempt to place data into the session was unsuccessful. The session may contain invalid data. A request operation using this session will be rejected by the payment gateway.

NO_UPDATE
No attempt has been made to place data into the session. A request operation using this session will be rejected by the payment gateway.

SUCCESS
The last attempt to update the session was successful. You may submit a request operation using this session.

session.version
ASCII Text
ALWAYS PROVIDED
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Create or Update Risk Assessment
Request to send a card transaction to a risk service provider without processing a payment.
You can use this operation when you want to:
Assess risk: request the risk service provider to assess the risk of a card transaction and provide a result. In this case set requestAction to RISK_ASSESSMENT.
Provide information only: inform the risk service provider about a card transaction or the outcome of processing a card transaction. You do not require the risk service provider to provide a risk assessment result. In this case set requestAction to INFORMATION_ONLY and provide details about the transaction processing result in the transactionProcessingResponse parameter group.
You can submit more than one risk assessment request for the same payment by using the same risk assessment ID. For example, you might want to assess the risk of a transaction before processing the payment and then provide an update to the risk service provider after it has been processed. Note that if the previous risk assessment was not successful (result=FAILURE) you must use a new risk assessment ID.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
riskassessment
/
{riskassessmentid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{riskassessmentid}
Alphanumeric + additional characters
REQUIRED
A unique identifier for this risk assessment to distinguish it from any other risk assessment you create.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_', ' ', '&', '+', '!', '$', '%', '.'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= CREATE_OR_UPDATE_RISK_ASSESSMENT
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
requestAction
Enumeration
REQUIRED
Informs the risk service provider how you want them to process the information you have provided in the request.

Informs the risk service provider how you want them to process the information you have provided in the request..

Value must be a member of the following list. The values are case sensitive.

INFORMATION_ONLY
You are informing the risk service provider about a card transaction or the outcome of a card transaction. You do not require the risk service provider to provide a risk assessment result.

RISK_ASSESSMENT
You are requesting the risk service provider to assess the risk of a card transaction and provide a risk assessment result.

sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

sourceOfFunds.provided
REQUIRED
Information about the source of funds when it is directly provided (as opposed to via a token or session).

For browser payments, the source of funds details are usually collected from the payer on the payment provider's website and provided to you when you retrieve the transaction details (for a successful transaction). However, for some payment types (such as giropay), you must collect the information from the payer and supply it here.

sourceOfFunds.provided.card
REQUIRED
Details about the card.

Use this parameter group when you have sourced payment details using:
Cards: the card details entered directly or collected using a Point of Sale (POS) terminal.
Device payment methods such as Apple Pay, Android Pay, Samsung Pay or Google Pay.
Digital wallets such as Masterpass, Visa Checkout or Amex Express Checkout.
Card scheme tokens where the card was tokenized using a card scheme tokenization service such as Mastercard Digital Enablement Service (MDES).

transaction
REQUIRED
Information about the transaction.

transaction.creationDate
DateTime
REQUIRED
The date and time the transaction was created in your system or in the system that you used to submit the transaction to the acquirer.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

transaction.source
Enumeration
REQUIRED
Indicates the channel through which you received authorization for the payment from the payer.

For example, set this value to INTERNET if the payer initiated the payment online.

If you have an existing agreement with the payer that authorizes you to process this payment (for example, a recurring payment) then set this value to MERCHANT.

Value must be a member of the following list. The values are case sensitive.

CALL_CENTRE
Transaction conducted via a call centre.

CARD_PRESENT
Transaction where the card is presented to the merchant.

INTERNET
Transaction conducted over the Internet.

MAIL_ORDER
Transaction received by mail.

MERCHANT
Transaction initiated by you based on an agreement with the payer. For example, a recurring payment, installment payment, or account top-up.

TELEPHONE_ORDER
Transaction received by telephone.

VOICE_RESPONSE
Transaction conducted by a voice/DTMF recognition system.

transaction.type
Enumeration
REQUIRED
Informs the risk service provider about the type of transaction for which you are requesting a risk assessment.

Value must be a member of the following list. The values are case sensitive.

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

OTHER
Any other transaction type

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_AUTHORIZATION
Refund Authorization

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Response
Fields
Show conditional fields 
id
Alphanumeric + additional characters
ALWAYS PROVIDED
A unique identifier for this risk assessment to distinguish it from any other risk assessment you create.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_', ' ', '&', '+', '!', '$', '%', '.'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the assessment.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Create or Update Browser Payment Token
Request the gateway to create or update a token that references a source of funds stored with a payment provider such as PayPal.

Use this operation to initiate a browser interaction, in which the payer authorizes you to make subsequent payments against their account. For PayPal, the token wraps a PayPal Billing Agreement. Like all gateway tokens, you can:

use them for subsequent payments (PayPal calls these reference transactions)
have a token repository that includes a mix of tokenized cards, tokenized PayPal and other tokenized accounts
update a token with a different account - for example, your payer moves from PayPal to/from card as their preferred payment method, then you can retain the same token.
Your payment service provider will configure your token repository for you (see How to Configure Tokenization for details). This will determine:

If you can supply the token yourself, or if the gateway will generate one for you.
If you can update a token with a different account.
The form of the token that the gateway will generate. The generated token id is a random number. It begins with a '9' (so that is does not create a valid card number) and passes a Luhn (Mod-10) check.
When the same account is retokenized, whether the gateway return the same token or a new token.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= TOKENIZE_BROWSER_PAYMENT
FIXED
Any sequence of zero or more unicode characters.

browserPayment
REQUIRED
Information required by the gateway to manage interactions with a browser payment provider's website.

browserPayment.returnUrl
Url
REQUIRED
The URL to which you want the payer's browser to be redirected on completing the payment at the payment provider's website.

The same redirect URL will be used by the gateway to redirect the payer's browser irrespective of the success or otherwise of the payment.

Ensure that this is a valid URL according to RFC 1738.

session.id
ASCII Text
REQUIRED
Identifier of the payment session containing values for any of the request fields to be used in this operation.

Values provided in the request will override values contained in the session.

Data consists of ASCII characters

Min length: 31 Max length: 35
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

sourceOfFunds.type
Enumeration
REQUIRED
The payment method used for this payment.

If you are passing card data (in any form) on the API, then you need to set this value, and also provide the card details in the sourceOfFunds.provided.card group. In the case of digital wallets or device payment methods, you must also populate the order.walletProvider field.

If you are making a payment with a gateway token, then you can leave this field unset, and only populate the sourceOfFunds.token field. However you can set this to CARD if you want to overwrite or augment the token data with a card security code, expiry date, or cardholder name.

Value must be a member of the following list. The values are case sensitive.

ALIPAY
The payer selected the payment method Alipay.

BANCONTACT
The payer selected the payment method Bancontact.

BLIK
The payer selected the payment method BLIK.

BOLETO_BANCARIO
The payer selected the payment method Boleto Bancario.

BROWSER_PAYMENT
The payer selected to pay using a browser payment. Refer to the sourceOfFunds.browserPayment parameter group for additional details.

ENETS
The payer selected the payment method eNETS.

EPS_UEBERWEISUNG
The payer selected the payment method eps-Überweisung.

GIROPAY
The payer selected the payment method giropay.

GRABPAY
The payer selected the payment method GrabPay.

IDEAL
The payer selected the payment method iDEAL.

KLARNA_FINANCING
The payer selected the payment method Klarna financing.

KLARNA_PAY_LATER
The payer selected the payment method Klarna Pay Later.

KLARNA_PAY_NOW
The payer selected the payment method Klarna Pay Now.

MERCADO_PAGO_CHECKOUT
The payer selected the payment method Mercado Pago Checkout.

MULTIBANCO
The payer selected the payment method Multibanco.

OPEN_BANKING_BANK_TRANSFER
The payer selected the payment method Open Banking Bank Transfer.

OXXO
The payer selected the payment method OXXO.

PAYCONIQ
The payer selected the payment method payconiq.

PAYPAL
The payer selected the payment method PayPal.

PAYSAFECARD
The payer selected the payment method paysafecard.

PAYU
The payer selected the payment method PayU.

POLI
The payer selected the payment method POLi.

PRZELEWY24
The payer selected the payment method Przelewy24.

SEPA
The payer selected the payment method SEPA.

SOFORT
The payer selected the payment method Sofortbanking.

TRUSTLY
The payer selected the payment method Trustly.

UNION_PAY
The payer selected the payment method UnionPay.

WECHAT_PAY
The payer selected the payment method WeChatPay.

Response
Fields
Show conditional fields 
browserPayment
ALWAYS PROVIDED
Information required by the gateway to manage interactions with a browser payment provider's website.

browserPayment.redirectUrl
Url
ALWAYS PROVIDED
The URL issued by the gateway to which you must redirect the payer's browser.

Ensure that this is a valid URL according to RFC 1738.

merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_', ' ', '&', '+', '!', '$', '%', '.'

Min length: 1 Max length: 40
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

BASIC_VERIFICATION_SUCCESSFUL
The card number format was successfully verified and the card exists in a known range.

EXTERNAL_VERIFICATION_BLOCKED
The external verification was blocked due to risk rules.

EXTERNAL_VERIFICATION_DECLINED
The card details were sent for verification, but were was declined.

EXTERNAL_VERIFICATION_DECLINED_AUTHENTICATION_REQUIRED
The card details were sent for verification, but were declined as authentication required.

EXTERNAL_VERIFICATION_DECLINED_EXPIRED_CARD
The card details were sent for verification, but were declined as the card has expired.

EXTERNAL_VERIFICATION_DECLINED_INVALID_CSC
The card details were sent for verification, but were declined as the Card Security Code (CSC) was invalid.

EXTERNAL_VERIFICATION_PROCESSING_ERROR
There was an error processing the verification.

EXTERNAL_VERIFICATION_SUCCESSFUL
The card details were successfully verified.

NO_VERIFICATION_PERFORMED
The card details were not verified.

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

session.id
ASCII Text
ALWAYS PROVIDED
Identifier of the payment session containing values for any of the request fields to be used in this operation.

Values provided in the request will override values contained in the session.

Data consists of ASCII characters

Min length: 31 Max length: 35
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

Create or Update Token
Request for the gateway to store a payment instrument against a token, where you provide the token ID.
This may include:
credit or debit card details
device payment details
gift card details
ACH bank account details
Canadian Direct Debit bank account details
PayPal billing agreement details
Note: The behaviour of this call depends on two aspects of your token repository configuration: Token Generation Strategy (either Merchant-Supplied, Random or Preserve 6.4) and Token Management strategy (Unique Card or Unique Token). For more information, see How to Configure Tokenization. Your Token Generation Strategy and Token Management Strategy are configured on your merchant profile (by your payment service provider).
For all repository configurations, you can use this call to update the details stored against the token. If you use a Merchant-Supplied generation strategy, you also use this call to create the token. However, to maintain the repository rules, the gateway will reject your request and generate an error if:
The repository is configured for the Token Generation Strategy Preserve 6.4 and you attempt to change the account identifier (e.g. the card number or ACH account number). This would break the 6.4 preservation rule. Note that this rule is not enforced for PayPal Billing Agreement IDs.
The repository is configured for the Token Management Strategy Unique Account Identifier and you attempt to update this token to an account identifier that is already assigned to another token and there. This would result in two tokens for the same account identifier, breaking the uniqueness rule.
If the repository is configured for scheme tokenization, the gateway will attempt to generate a scheme token for the stored card details.

If you want to tokenize card details associated to a previously successful payment, you can provide the order identifier of that payment using the field referenceOrderId. The order identifier provided in referenceOrderId must have card as the payment method, which includes both FPAN and DPAN based transactions. If it is the latter, the gateway won't attempt scheme tokenization even if you are enabled for scheme tokenization.

The gateway does not currently have support to store PayPal payment details against a gateway token.

However, you can
use this operation to store existing PayPal billing agreement details against a gateway token, for example, when migrating to the gateway.
use the Create or Update Browser Payment Token operation to create or update a gateway token with PayPal billing agreement details.
If you provide a shipping address or shipping contact details, these will be ignored unless the token contains PayPal billing agreement details.

Note that the name on the card, billing address details, and customer details are only used by the gateway when submitting the tokenization request to the token service provider. These details are not stored against the gateway token.

If you tokenize card details provided by a payer via their issuer (i.e. push provisioning of scheme tokens), use this operation to supply the reference provided by the issuer for provisioning the scheme token. This reference will be used by the gateway to retrieve the scheme token and card details from the token service provider e.g. MDES.


PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
token
/
{tokenid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{tokenid}
Alphanumeric
REQUIRED
Uniquely identifies a card and associated details.


Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the Save operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

status
Enumeration
ALWAYS PROVIDED
An indicator of whether or not you can use this token in transaction requests.

Transaction requests using an invalid token are rejected by the gateway.

To change the token status, update the payment details stored against the token. Note that there are limitations on the update functionality depending on how your payment service provider has configured your token repository.

Card Details

A token that contains card details can become invalid in the following cases:

Scheme Token Provider: If a response or notification from the scheme token provider indicates that the card number for this scheme token has changed and the scheme token is no longer active.
Recurring Payment Advice: If the acquirer response for a recurring payment indicates that you must not attempt another recurring payment with the card number stored against this token.
Account Updater: If you are configured for Account Updater and an Account Updater response indicates that the card details are no longer valid.


PayPal Details

A token that contains PayPal payment details becomes invalid when the payer withdraws their consent to the Billing Agreement.


Value must be a member of the following list. The values are case sensitive.

INVALID
The payment details stored against the token have been identified as invalid. The gateway will reject operation payment requests using this token.

VALID
The payment details stored against the token are considered to be valid. The gateway will attempt to process operation requests using this token.

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Create or Update Token (with system-generated token)
Request for the gateway to store a payment instrument against a token, where the system generates the token ID.
This may include:
credit or debit card details
device payment details
gift card details
ACH bank account details
Canadian Direct Debit bank account details
PayPal billing agreement details
Note: The behaviour of this call depends on two aspects of your token repository configuration: Token Generation Strategy (either Merchant-Supplied, Random or Preserve 6.4) and Token Management strategy (Unique Card or Unique Token). For more information, see How to Configure Tokenization. Your Token Generation Strategy and Token Management Strategy are configured on your merchant profile (by your payment service provider).
If you are configured to use the Token Generation Strategy Random or Preserve 6.4', you can use this call to create the token. If you use the Token Generation Strategy Merchant-Supplied, do not use this call but use the Tokenize call instead.
Typically, this call will return a new token. However, if the repository is configured for the Token Management Strategy Unique Account Identifier and the supplied account identifier (e.g. card number or PayPal Billing Agreement ID) has previously been stored against an existing token, the gateway will return that token.
If the repository is configured for scheme tokenization, the gateway will attempt to generate a scheme token for the stored card details.

If you want to tokenize card details associated to a previously successful payment, you can provide the order identifier of that payment using the field referenceOrderId. The order identifier provided in referenceOrderId must have card as the payment method, which includes both FPAN and DPAN based transactions. If it is the latter, the gateway won't attempt scheme tokenization even if you are enabled for scheme tokenization.

The gateway does not currently have support to store PayPal payment details against a gateway token.

However, you can
use this operation to store existing PayPal billing agreement details against a gateway token, for example, when migrating to the gateway.
use the Create or Update Browser Payment Token operation to create or update a gateway token with PayPal billing agreement details.
If you provide a shipping address or shipping contact details, these will be ignored unless the token contains PayPal billing agreement details.

Note that the name on the card, billing address details, and customer details are only used by the gateway when submitting the tokenization request to the token service provider. These details are not stored against the gateway token.

If you tokenize card details provided by a payer via their issuer (i.e. push provisioning of scheme tokens), use this operation to supply the reference provided by the issuer for provisioning the scheme token. This reference will be used by the gateway to retrieve the scheme token and card details from the token service provider e.g. MDES.


POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
token
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the Save operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

status
Enumeration
ALWAYS PROVIDED
An indicator of whether or not you can use this token in transaction requests.

Transaction requests using an invalid token are rejected by the gateway.

To change the token status, update the payment details stored against the token. Note that there are limitations on the update functionality depending on how your payment service provider has configured your token repository.

Card Details

A token that contains card details can become invalid in the following cases:

Scheme Token Provider: If a response or notification from the scheme token provider indicates that the card number for this scheme token has changed and the scheme token is no longer active.
Recurring Payment Advice: If the acquirer response for a recurring payment indicates that you must not attempt another recurring payment with the card number stored against this token.
Account Updater: If you are configured for Account Updater and an Account Updater response indicates that the card details are no longer valid.


PayPal Details

A token that contains PayPal payment details becomes invalid when the payer withdraws their consent to the Billing Agreement.


Value must be a member of the following list. The values are case sensitive.

INVALID
The payment details stored against the token have been identified as invalid. The gateway will reject operation payment requests using this token.

VALID
The payment details stored against the token are considered to be valid. The gateway will attempt to process operation requests using this token.

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Delete Token
Request to delete a token.

DELETE
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
token
/
{tokenid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{tokenid}
Alphanumeric
REQUIRED
Uniquely identifies a card and associated details.


Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Generate Payment Data
Request to obtain the payment details for the specified token that can be used for a payment authorization.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
token
/
{tokenid}
/
paymentData
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{tokenid}
Alphanumeric
REQUIRED
Uniquely identifies a card and associated details.


Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
repositoryId
ASCII Text
ALWAYS PROVIDED
The unique identifier of the token repository associated with the merchant.

Data consists of ASCII characters

Min length: 1 Max length: 16
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, token service provider, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

sourceOfFunds
ALWAYS PROVIDED
Details about the source of the funds for this payment.

sourceOfFunds.provided
ALWAYS PROVIDED
The details of the source of funds when they are directly provided as opposed to via a token or session.

sourceOfFunds.type
Enumeration
ALWAYS PROVIDED
The payment method your payer has chosen for this payment.

Value must be a member of the following list. The values are case sensitive.

CARD
Use this value for payments that obtained the card details either directly from the card, or from a POS terminal, or from a wallet, or through a device payment method.

SCHEME_TOKEN
Use this value for payments using scheme tokens provided by Mastercard Digital Enablement Service (MDES), or Visa Token Service (VTS), or American Express Token Service (AETS).

status
Enumeration
ALWAYS PROVIDED
An indicator of whether or not you can use this token in transaction requests.

Transaction requests using an invalid token are rejected by the gateway.

To change the token status, update the payment details stored against the token. Note that there are limitations on the update functionality depending on how your payment service provider has configured your token repository.

Card Details

A token that contains card details can become invalid in the following cases:

Scheme Token Provider: If a response or notification from the scheme token provider indicates that the card number for this scheme token has changed and the scheme token is no longer active.
Recurring Payment Advice: If the acquirer response for a recurring payment indicates that you must not attempt another recurring payment with the card number stored against this token.
Account Updater: If you are configured for Account Updater and an Account Updater response indicates that the card details are no longer valid.


PayPal Details

A token that contains PayPal payment details becomes invalid when the payer withdraws their consent to the Billing Agreement.

INVALID - The payment details stored against the token have been identified as invalid. The gateway will reject operation payment requests using this token.
VALID - The payment details stored against the token are considered to be valid. The gateway will attempt to process operation requests using this token.



Value must be a member of the following list. The values are case sensitive.

INVALID
The payment details stored against the token have been identified as invalid. The gateway will reject operation payment requests using this token.

VALID
The payment details stored against the token are considered to be valid. The gateway will attempt to process operation requests using this token.

token
Alphanumeric
ALWAYS PROVIDED
A gateway token that contains account identifier details.

Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 40
usage
ALWAYS PROVIDED
Information about the usage of the token.

usage.lastUpdated
ALWAYS PROVIDED
Information about the most recent change made to the token.

usage.lastUpdated.merchantId
Alphanumeric + additional characters
ALWAYS PROVIDED
If the token was last updated by a merchant this field contains the merchant ID of the merchant that made the update.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
usage.lastUpdated.source
Enumeration
ALWAYS PROVIDED
Indicates the source of the last update to the token.

Value must be a member of the following list. The values are case sensitive.

CLIENT
The token was last updated by a merchant submitting a Tokenize request. Field usage.lastUpdated.merchantId will contain the ID of the merchant that made the update.

GATEWAY
The token was last updated by the gateway as a result of the Account Updater or Token Maintenance Service functionality.

usage.lastUpdated.time
DateTime
ALWAYS PROVIDED
The timestamp indicating the date and time the token was last updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

usage.lastUsedTime
DateTime
ALWAYS PROVIDED
The timestamp indicating the date and time the token was last used or saved.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

Retrieve Token
Request to retrieve the payment details saved against the specified token.

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
token
/
{tokenid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{tokenid}
Alphanumeric
REQUIRED
Uniquely identifies a card and associated details.


Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the transaction/operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

status
Enumeration
ALWAYS PROVIDED
An indicator of whether or not you can use this token in transaction requests.

Transaction requests using an invalid token are rejected by the gateway.

To change the token status, update the payment details stored against the token. Note that there are limitations on the update functionality depending on how your payment service provider has configured your token repository.

Card Details

A token that contains card details can become invalid in the following cases:

Scheme Token Provider: If a response or notification from the scheme token provider indicates that the card number for this scheme token has changed and the scheme token is no longer active.
Recurring Payment Advice: If the acquirer response for a recurring payment indicates that you must not attempt another recurring payment with the card number stored against this token.
Account Updater: If you are configured for Account Updater and an Account Updater response indicates that the card details are no longer valid.


PayPal Details

A token that contains PayPal payment details becomes invalid when the payer withdraws their consent to the Billing Agreement.


Value must be a member of the following list. The values are case sensitive.

INVALID
The payment details stored against the token have been identified as invalid. The gateway will reject operation payment requests using this token.

VALID
The payment details stored against the token are considered to be valid. The gateway will attempt to process operation requests using this token.

usage
ALWAYS PROVIDED
Information about the usage of the token.

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Search Tokens
Request to find token records that match the query. If the token records span across pages, you can limit the results returned per page and retrieve the next set of results using subsequent requests.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
tokenSearch
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.Authorize
Request to obtain an authorization for a proposed funds transfer. An authorization is a response from a financial institution indicating that payment information is valid and funds are available in the payers account.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= AUTHORIZE
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.netAmount
Decimal
OPTIONAL
The amount payable for the order before merchant charge amount is applied.

If you specify a net amount the gateway will calculate the merchant charge amount for you based on the charge type (order.merchantCharge.type) provided in the request. Alternatively, you can specify the merchant charge amount (order.merchantCharge.amount) yourself.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Authorize
Request to obtain an authorization for a proposed funds transfer. An authorization is a response from a financial institution indicating that payment information is valid and funds are available in the payers account.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= AUTHORIZE
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.netAmount
Decimal
OPTIONAL
The amount payable for the order before merchant charge amount is applied.

If you specify a net amount the gateway will calculate the merchant charge amount for you based on the charge type (order.merchantCharge.type) provided in the request. Alternatively, you can specify the merchant charge amount (order.merchantCharge.amount) yourself.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Balance Inquiry
Request to retrieve the balance available to spend on a card. You can use this operation to request: The balance available on a gift card, or The balance available to spend by redeeming rewards earned using a card enrolled in a rewards program. For gift cards, only the balance available is returned. For credit or debit cards enrolled in the American Express Membership Rewards program, points available to redeem and the conversion rate used to determine the available balance are returned.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
balanceInquiry
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

sourceOfFunds.type
Enumeration
REQUIRED
The payment method used for this payment.

If you are passing card data (in any form) on the API, then you need to set this value, and also provide the card details in the sourceOfFunds.provided.card group. In the case of digital wallets or device payment methods, you must also populate the order.walletProvider field.

If you are making a payment with a gateway token, then you can leave this field unset, and only populate the sourceOfFunds.token field. However you can set this to CARD if you want to overwrite or augment the token data with a card security code, expiry date, or cardholder name.

Value must be a member of the following list. The values are case sensitive.

CARD
Use this value for payments that obtained the card details either directly from the card, or from a POS terminal, or from a wallet, or through a device payment method.

GIFT_CARD
Use this value for gift cards.

Response
Fields
Show conditional fields 
availableBalance
ALWAYS PROVIDED
Information about the rewards currently available to redeem for the card.

merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
Your identifier issued to you by your provider.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
response
ALWAYS PROVIDED
Value as generated by the acquirer that summarizes the success or otherwise of the proposed operation.

response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

sourceOfFunds
ALWAYS PROVIDED
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Capture
Request to capture funds previously reserved by an authorization. A Capture transaction triggers the movement of funds from the payer's account to the merchant's account. Typically, a Capture is linked to the authorization through the orderId - you provide the original orderId, a new transactionId, and the amount you wish to capture. You may provide other fields (such as shipping address) if you want to update their values; however, you must NOT provide sourceOfFunds.
In rare situations, you may want to capture against an authorization that you obtained from elsewhere (see Standalone Capture). In this case, you need to provide all the relevant fields, including the sourceOfFunds and transaction.authorizationCode, in addition to a new orderId.


PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= CAPTURE
FIXED
Any sequence of zero or more unicode characters.

transaction
REQUIRED
Information about this transaction.

transaction.amount
Decimal
REQUIRED
Transaction Amount.

Expressed as a decimal number in the units of the currency. For example 12.34 in USD is the amount 12 dollars and 34 cents.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
transaction.currency
Upper case alphabetic text
REQUIRED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Disbursement
Use this operation to pay out funds to a payer, for example when you want to disburse gaming winnings or pay a payer's credit card bill.
Note that this differs from a refund, where you are returning funds to the payer for parts or all of a purchase that they did not receive or where they returned the goods.


PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= DISBURSEMENT
FIXED
Any sequence of zero or more unicode characters.

disbursementType
Enumeration
REQUIRED
The type of disbursement used for this transaction.

For a salary payout, use the value BUSINESS_DISBURSEMENT

Value must be a member of the following list. The values are case sensitive.

BUSINESS_DISBURSEMENT
Indicates a disbursement made by a business entity, such as salary payouts.

RAPID_MERCHANT_SETTLEMENT
Indicates a settlement payout made by a merchant or aggregator, such as settlement payout to sub-merchants.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
REQUIRED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
paymentRecipient
REQUIRED
Information about the payment recipient, including their address and contact details.

paymentRecipient.address
REQUIRED
The payment recipient's address.

paymentRecipient.address.city
String
REQUIRED
The city portion of the address.

Data can consist of any characters

Min length: 1 Max length: 25
paymentRecipient.address.country
Upper case alphabetic text
REQUIRED
The 3 letter ISO standard alpha country code of the address.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
paymentRecipient.address.street
String
REQUIRED
The first line of the address.

For example, this may be the street name and number, or the Post Office Box details.

Note: The transaction response will contain a concatenation of street and street2 data. If the concatenated value is more than the maximum field length, street2 data will be truncated.

Data can consist of any characters

Min length: 1 Max length: 50
paymentRecipient.firstName
String
REQUIRED
The payment recipient's first name.

Data can consist of any characters

Min length: 1 Max length: 50
paymentRecipient.lastName
String
REQUIRED
The payment recipient's last name.

Data can consist of any characters

Min length: 1 Max length: 50
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Pay
A single transaction to authorise the payment and transfer funds from the payer's account to your account.
For card payments, Pay is a mode where the Authorize and Capture operations are completed at the same time. Pay is the most common type of payment model used by merchants to accept card payments. The Pay model is used when the merchant is allowed to bill the cardholder's account immediately, for example when providing services or goods on the spot.


PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= PAY
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.netAmount
Decimal
OPTIONAL
The amount payable for the order before merchant charge amount is applied.

If you specify a net amount the gateway will calculate the merchant charge amount for you based on the charge type (order.merchantCharge.type) provided in the request. Alternatively, you can specify the merchant charge amount (order.merchantCharge.amount) yourself.

Either Amount or netAmount must be provided

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Referral
Request to resubmit a referred initial transaction (Authorization or Pay transaction that received a "Refer to Issuer" acquirer response) as a new Authorization or Pay transaction with an authorization code obtained from the issuer.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= REFERRAL
FIXED
Any sequence of zero or more unicode characters.

transaction
REQUIRED
transaction.authorizationCode
Alphanumeric
REQUIRED
Value generated by the issuing bank in response to a proposal to transfer funds.

Data may consist of the characters 0-9, a-z, A-Z

Min length: 1 Max length: 6
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Refund
Request to refund previously captured funds to the payer. Typically, a Refund is linked to the Capture or Pay through the orderId - you provide the original orderId, a new transactionId, and the amount you wish to refund. You may provide other fields if you want to update their values; however, you must NOT provide sourceOfFunds.
In rare situations, you may want to refund the payer without associating the credit to a previous transaction (see Standalone Refund). In this case, you need to provide the sourceOfFunds and a new orderId.


PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= REFUND
FIXED
Any sequence of zero or more unicode characters.

transaction
REQUIRED
Information about this transaction.

transaction.amount
Decimal
REQUIRED
Transaction Amount.

Expressed as a decimal number in the units of the currency. For example 12.34 in USD is the amount 12 dollars and 34 cents.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
transaction.currency
Upper case alphabetic text
REQUIRED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Retrieve Order
Request to retrieve the details of an order and all transactions associated with this order.

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

Retrieve Transaction
Request to retrieve the details of a transaction. For example you can retrieve the details of an authorization that you previously executed.

GET
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
To view the optional fields, please toggle on the "Show optional fields" setting.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

Update Application Transaction Counter
Use this operation to update the Application Transaction Counter (ATC) maintained at the issuer with the latest ATC from the chip on the card. For processing of transaction such as Aggregated Transit Fare, you may be required to send an ATC Update to the issuer in accordance with the scheme rules.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
applicationTransactionCounter
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= UPDATE_APPLICATION_TRANSACTION_COUNTER
FIXED
Any sequence of zero or more unicode characters.

sourceOfFunds
REQUIRED
Information about the payment type selected by the payer for this payment and the source of the funds.

Depending on the payment type the source of the funds can be a debit or credit card, bank account, or account with a browser payment provider (such as PayPal).

For card payments the source of funds information may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

sourceOfFunds.provided
REQUIRED
Information about the source of funds when it is directly provided (as opposed to via a token or session).

For browser payments, the source of funds details are usually collected from the payer on the payment provider's website and provided to you when you retrieve the transaction details (for a successful transaction). However, for some payment types (such as giropay), you must collect the information from the payer and supply it here.

sourceOfFunds.provided.card
REQUIRED
Details about the card.

Use this parameter group when you have sourced payment details using:
Cards: the card details entered directly or collected using a Point of Sale (POS) terminal.
Device payment methods such as Apple Pay, Android Pay, Samsung Pay or Google Pay.
Digital wallets such as Masterpass, Visa Checkout or Amex Express Checkout.
Card scheme tokens where the card was tokenized using a card scheme tokenization service such as Mastercard Digital Enablement Service (MDES).
Alternative IDs provided by the schemes, such as Alt-Id for Guest Checkout payments in India using American Express, Rupay cards issued in India.

sourceOfFunds.provided.card.emvRequest
String
REQUIRED
This field only applies to transactions that originate from an EMV capable terminal.

It contains selected EMV fields as provided by the terminal.

For the list of field tags to include (if provided by the terminal), see Card Present Payments. Requests with any other tags are rejected by the gateway.

Some of the tags represent data that can occur on explicit fields in this API. You can submit the value either in this field, or in both places. For example, the PAN can be presented as EMV tag 5A in this field, or included both the sourceOfFunds.provided.card.number API field and in EMV tag 5A in this field.

If you specify the EMV tag only, we can populate the explicit field in the API. Fields where this is supported have the text "This field corresponds to EMV tag <tag name>" in their field descriptions.

If you specify both places, there will be no population of the explicit field or validation that the data matches.

The API response will not contain PCI sensitive fields.

Data can consist of any characters

Min length: 1 Max length: 250
sourceOfFunds.type
Enumeration
REQUIRED
The payment method used for this payment.

If you are passing card data (in any form) on the API, then you need to set this value, and also provide the card details in the sourceOfFunds.provided.card group. In the case of digital wallets or device payment methods, you must also populate the order.walletProvider field.

If you are making a payment with a gateway token, then you can leave this field unset, and only populate the sourceOfFunds.token field. However you can set this to CARD if you want to overwrite or augment the token data with a card security code, expiry date, or cardholder name.

Note: UPDATE_APPLICATION_TRANSACTION_COUNTER supports only type CARD.

Value must be a member of the following list. The values are case sensitive.

CARD
Use this value for payments that obtained the card details either directly from the card, or from a POS terminal, or from a wallet, or through a device payment method.

EBT_CARD
Use this value for Electronic Benefits Transfer (EBT) card payments. The additional EBT data must also be provided in the sourceOfFunds.provided.ebt parameter group.

GIFT_CARD
The payer chose to pay using a gift card. The payer's gift card details must be provided under the sourceOfFunds.provided.giftCard parameter group.

SCHEME_TOKEN
Use this value for payments using scheme tokens provided by Mastercard Digital Enablement Service (MDES), or Visa Token Service (VTS), or American Express Token Service (AETS).

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
response
ALWAYS PROVIDED
response.result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.receipt
ASCII Text
ALWAYS PROVIDED
A unique reference generated by the acquirer for a specific merchant interaction.

The reference may be used when contacting the acquirer about a specific transaction.

Data consists of ASCII characters

Min length: 1 Max length: 100
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Update Authorization
Request to update an existing authorization. If successful, this operation allows you to extend the authorization period and/or update the authorized amount for this order.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= UPDATE_AUTHORIZATION
FIXED
Any sequence of zero or more unicode characters.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Verify
Request to verify the cardholder's account before processing the financial transaction. The card is verified using the verification method supported by the acquirer and the data provided in the request.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= VERIFY
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Information about the order associated with this transaction.

order.currency
Upper case alphabetic text
REQUIRED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
sourceOfFunds
REQUIRED
The details describing the source of the funds to be used.

For card payments these may be represented by combining one or more of the following: explicitly provided card details, a session identifier which the gateway will use to look up the card details and/or a card token. Precedence rules will be applied in that explicitly provided card details will override session card details which will override card token details. Each of these may represent partial card details, however the combination must result in a full and complete set of card details. See Using Multiple Sources of Card Details for examples.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Void
Request to void a previous transaction. A void will reverse a previous transaction. Typically voids will only be successful when processed not long after the original transaction.

PUT
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
order
/
{orderid}
/
transaction
/
{transactionid}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{orderid}
String
REQUIRED
A unique identifier for this order to distinguish it from any other order you create.


Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order you create using your merchant profile.


Data can consist of any characters

Min length: 1 Max length: 40
{transactionid}
String
REQUIRED
Unique identifier for this transaction to distinguish it from any other transaction on the order.


An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.


Data can consist of any characters

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= VOID
FIXED
Any sequence of zero or more unicode characters.

transaction
REQUIRED
Information about this transaction.

transaction.targetTransactionId
String
REQUIRED
The identifier for the transaction you wish to void.

That is the {transactionId} URL field for REST and the transaction.id field for NVP.

Data can consist of any characters

Min length: 1 Max length: 40
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
Information about the order associated with this transaction.

order.amount
Decimal
ALWAYS PROVIDED
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.creationTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have been created.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.id
String
ALWAYS PROVIDED
A unique identifier for this order to distinguish it from any other order you create.

Use this identifier when referring to this order in subsequent transactions and in retrieval operations. This value must be unique for every order created by your merchant profile.

Data can consist of any characters

Min length: 1 Max length: 40
order.lastUpdatedTime
DateTime
ALWAYS PROVIDED
Indicates the date and time the gateway considers the order to have last been updated.

An instant in time expressed in ISO8601 date + time format - "YYYY-MM-DDThh:mm:ss.SSSZ"

order.merchantAmount
Decimal
ALWAYS PROVIDED
The total amount for the order in order.merchantCurrency units.

This is derived from the rate quote and order.amount for this order when Multi-Currency Pricing was used.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.merchantCurrency
Upper case alphabetic text
ALWAYS PROVIDED
The currency in which you priced your inventory for this order, expressed as an ISO 4217 alpha code, e.g. USD.

This value (along with merchantAmount) is applicable if you are doing Multi-Currency Pricing, as it gives you a consistent currency across all your orders that involve foreign exchange (FX).

If there is FX on this order, this is based on the rate quote you provided on the payment transactions, if not then this is the order.currency.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.totalAuthorizedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully authorized for this order including any amount adjustments made via incremental authorizations or partial reversals.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalCapturedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully captured for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalDisbursedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully disbursed for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.totalRefundedAmount
Decimal
ALWAYS PROVIDED
The amount that has been successfully refunded for this order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
response
ALWAYS PROVIDED
response.gatewayCode
Enumeration
ALWAYS PROVIDED
Summary of the success or otherwise of the operation.

Value must be a member of the following list. The values are case sensitive.

ABORTED
Transaction aborted by payer

ACQUIRER_SYSTEM_ERROR
Acquirer system error occurred processing the transaction

APPROVED
Transaction Approved

APPROVED_AUTO
The transaction was automatically approved by the gateway. it was not submitted to the acquirer.

APPROVED_PENDING_SETTLEMENT
Transaction Approved - pending batch settlement

AUTHENTICATION_FAILED
Payer authentication failed

AUTHENTICATION_IN_PROGRESS
The operation determined that payer authentication is possible for the given card, but this has not been completed, and requires further action by the merchant to proceed.

BALANCE_AVAILABLE
A balance amount is available for the card, and the payer can redeem points.

BALANCE_UNKNOWN
A balance amount might be available for the card. Points redemption should be offered to the payer.

BLOCKED
Transaction blocked due to Risk or 3D Secure blocking rules

CANCELLED
Transaction cancelled by payer

DECLINED
The requested operation was not successful. For example, a payment was declined by issuer or payer authentication was not able to be successfully completed.

DECLINED_AVS
Transaction declined due to address verification

DECLINED_AVS_CSC
Transaction declined due to address verification and card security code

DECLINED_CSC
Transaction declined due to card security code

DECLINED_DO_NOT_CONTACT
Transaction declined - do not contact issuer

DECLINED_INVALID_PIN
Transaction declined due to invalid PIN

DECLINED_PAYMENT_PLAN
Transaction declined due to payment plan

DECLINED_PIN_REQUIRED
Transaction declined due to PIN required

DEFERRED_TRANSACTION_RECEIVED
Deferred transaction received and awaiting processing

DUPLICATE_BATCH
Transaction declined due to duplicate batch

EXCEEDED_RETRY_LIMIT
Transaction retry limit exceeded

EXPIRED_CARD
Transaction declined due to expired card

INSUFFICIENT_FUNDS
Transaction declined due to insufficient funds

INVALID_CSC
Invalid card security code

LOCK_FAILURE
Order locked - another transaction is in progress for this order

NOT_ENROLLED_3D_SECURE
Card holder is not enrolled in 3D Secure

NOT_SUPPORTED
Transaction type not supported

NO_BALANCE
A balance amount is not available for the card. The payer cannot redeem points.

PARTIALLY_APPROVED
The transaction was approved for a lesser amount than requested. The approved amount is returned in order.totalAuthorizedAmount.

PENDING
Transaction is pending

REFERRED
Transaction declined - refer to issuer

SUBMITTED
The transaction has successfully been created in the gateway. It is either awaiting submission to the acquirer or has been submitted to the acquirer but the gateway has not yet received a response about the success or otherwise of the payment.

SYSTEM_ERROR
Internal system error occurred processing the transaction

TIMED_OUT
The gateway has timed out the request to the acquirer because it did not receive a response. Points redemption should not be offered to the payer.

UNKNOWN
The transaction has been submitted to the acquirer but the gateway was not able to find out about the success or otherwise of the payment. If the gateway subsequently finds out about the success of the payment it will update the response code.

UNSPECIFIED_FAILURE
Transaction could not be processed

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

FAILURE
The operation was declined or rejected by the gateway, acquirer or issuer

PENDING
The operation is currently in progress or pending processing

SUCCESS
The operation was successfully processed

UNKNOWN
The result of the operation is unknown

transaction
ALWAYS PROVIDED
Information about this transaction.

transaction.acquirer
ALWAYS PROVIDED
transaction.amount
Decimal
ALWAYS PROVIDED
The total amount for the transaction.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
transaction.currency
Upper case alphabetic text
ALWAYS PROVIDED
The currency of the transaction expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
transaction.id
String
ALWAYS PROVIDED
Unique identifier for this transaction to distinguish it from any other transaction on the order.

An order can have transactions representing:
Movement of money. For example, payments and refunds.
Validations. For example, account verification or 3-D Secure authentication of the payer.
Undoing other transactions. For example, voiding a payment transaction.
Chargebacks.
Fees from your payment service provider.
Each transaction on the order must have a unique id that identifies that transaction. Some transactions also hold the transaction identifier of other transactions on the order. For example a void payment transaction references the original payment transaction that is being voided.

If you attempt an operation and it fails (eg you try to PAY on a card with no funds), then you need a new id for each retry.

Data can consist of any characters

Min length: 1 Max length: 40
transaction.type
Enumeration
ALWAYS PROVIDED
Indicates the type of action performed on the order.

Value must be a member of the following list. The values are case sensitive.

AUTHENTICATION
Authentication

AUTHORIZATION
Authorization

AUTHORIZATION_UPDATE
Authorization Update

CAPTURE
Capture

CHARGEBACK
Chargeback

DISBURSEMENT
Disbursement

FUNDING
The transaction transfers money to or from the merchant, without the involvement of a payer. For example, recording monthly merchant service fees from your payment service provider.

PAYMENT
Payment (Purchase)

REFUND
Refund

REFUND_REQUEST
Refund Request

VERIFICATION
Verification

VOID_AUTHORIZATION
Void Authorization

VOID_CAPTURE
Void Capture

VOID_PAYMENT
Void Payment

VOID_REFUND
Void Refund

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.



Documentación
Referencia de API

español (México)
REST-JSON
NVP
Version
100 (latest)
Back
Wallet
POST
Open Wallet

POST
Pair With Wallet

POST
Retrieve Wallet Options

POST
Retrieve Wallet Pairing Result

POST
Update Session From Wallet

Open Wallet
Depending on the wallet provider, this operation initiates a wallet interaction.

For the MasterPass Online wallet, use this operation to initiate a wallet interaction. You reference the MasterPass JavaScript client library in your page, and use the response parameters from this operation in the checkoutButton method to open the MasterPass lightbox. The gateway will manage all of the back-end interactions with MasterCard.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
/
{sessionId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{sessionId}
ASCII Text
REQUIRED
The identifier of the payment session


Data consists of ASCII characters

Min length: 31 Max length: 35
Fields
Show optional fields 
correlationId
String
OPTIONAL
A transient identifier for the request, that can be used to match the response to the request.

The value provided is not validated, does not persist in the gateway, and is returned as provided in the response to the request.

Data can consist of any characters

Min length: 1 Max length: 100
order
REQUIRED
order

order.amount
Decimal
OPTIONAL
The total amount for the order.  This is the net amount plus any merchant charge amounts.If you provide any sub-total amounts, then the sum of these amounts (order.itemAmount, order.taxAmount, order.shippingAndHandlingAmount, order.cashbackAmount, order.gratuityAmount, order.merchantCharge.amount and order.dutyAmount), minus the order.discountAmount must equal the net amount.

The value of this field in the response is zero if payer funds are not transferred.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.cashbackAmount
Decimal
OPTIONAL
The amount the payer has chosen to receive as cash in addition to the amount they are paying for the goods or services they are purchasing from you.

The cash back amount is included in the total amount of the order you provide in order.amount.

This field corresponds to EMV tag 9F03

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.currency
Upper case alphabetic text
OPTIONAL
The currency of the order expressed as an ISO 4217 alpha code, e.g. USD.

Data must consist of the characters A-Z

Min length: 3 Max length: 3
order.description
String
OPTIONAL
Short textual description of the contents of the order.

Data can consist of any characters

Min length: 1 Max length: 127
order.discount
OPTIONAL
Information about a price reduction you have applied to the order.

For example, you may apply discounts for trade, employees, bulk purchase, or a sales promotion.

order.discount.amount
Decimal
OPTIONAL
The total amount of the discount you have applied to the order.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.discount.code
String
OPTIONAL
The code you use to identify the reason for the discount.

Data can consist of any characters

Min length: 1 Max length: 40
order.discount.description
String
OPTIONAL
A description of your reason for the discount.

Data can consist of any characters

Min length: 1 Max length: 127
order.dutyAmount
Decimal
OPTIONAL
The duty amount (also known as customs tax, tariff or dues) for the order.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.gratuityAmount
Decimal
OPTIONAL
The amount the payer has chosen to provide as a gratuity or tip in addition to the amount they are paying for the goods or services they are purchasing from you.

The gratuity amount is included in the total amount of the order you provide in order.amount.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.shippingAndHandlingAmount
Decimal
OPTIONAL
The total shipping and handling amount for the order, including taxes on the shipping and/or handling.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.shippingAndHandlingTaxAmount
Decimal
OPTIONAL
The tax amount levied on the shipping and handling amount for the order.

This amount is included in the shipping and handling amount provided in field order.shippingAndHandlingAmount.

Data is a decimal number.

Max value: 1000000000000 Min value: 0 Max post-decimal digits: 3
order.shippingAndHandlingTaxRate
Decimal
OPTIONAL
The tax rate applied to the shipping and handling amount for the order to determine the shipping and handling tax amount.

For a tax rate of 2.5% provide 0.025.

Data is a decimal number.

Max value: 1000000000000000000 Min value: 0 Max post-decimal digits: 4
order.tax[n]
OPTIONAL
Use this parameter group to provide a breakdown of tax types, amount per tax type, and rate per tax type included in order.taxAmount.

order.tax[n].amount
Decimal
OPTIONAL
The tax amount included in this order for the tax type.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.tax[n].rate
Decimal
OPTIONAL
The tax rate (percentage) used to determine the tax amount included in this order for the tax type.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 6
order.tax[n].type
String
OPTIONAL
The type of tax included in the order amount.

The correct value as used by your acquirer may have to be provided. Contact your payment service provider for details.

Data can consist of any characters

Min length: 1 Max length: 50
order.taxAmount
Decimal
OPTIONAL
The total tax amount for the order.

If you do not provide this value but provide line item data, then this amount is calculated as the sum of the item.quantity times the item.unitTaxAmount for all the line items (total tax amount).
If you provide both this value and line item data, then the order.taxAmount MUST equal the total tax amount.

Data is a string that consists of the characters 0-9 and '.' and represents a valid decimal number.

Min length: 1 Max length: 14
order.transactionFiltering
OPTIONAL
Information relevant for Transaction Filtering.

order.transactionFiltering.avsResponseCodeRules[n]
OPTIONAL
Allows you to provide the Address Verification Service (AVS) Response Code Transaction Filtering rules to be applied to the transactions for this order.

If provided, these rules override the AVS Response Code Transaction Filtering rules you have configured in Merchant Administration.

order.transactionFiltering.avsResponseCodeRules[n].action
Enumeration
REQUIRED
The action to be performed for the Address Verification Service (AVS) Response Code.

Value must be a member of the following list. The values are case sensitive.

NO_ACTION
No action should be taken by the gateway.

REJECT
The gateway must reject the transaction.

REVIEW
The gateway must mark this transaction as requiring a review.

order.transactionFiltering.avsResponseCodeRules[n].avsResponseCode
Enumeration
REQUIRED
The Address Verification Service (AVS) Response Code for which you are defining the rule.

Value must be a member of the following list. The values are case sensitive.

ADDRESS_MATCH
Street address matched

ADDRESS_ZIP_MATCH
Street address and zip/postcode were matched

NAME_ADDRESS_MATCH
Card holder name and street address matched

NAME_MATCH
Card holder name matched

NAME_ZIP_MATCH
Card holder name and zip/postcode matched

NOT_AVAILABLE
No data available from issuer or AVS data not supported for transaction

NOT_REQUESTED
AVS not requested

NOT_VERIFIED
AVS could not be verified for an international transaction

NO_MATCH
No match

SERVICE_NOT_AVAILABLE_RETRY
Issuer system is unavailable. Retry can be attempted

SERVICE_NOT_SUPPORTED
Service currently not supported by acquirer or merchant

ZIP_MATCH
Zip/postcode matched. Street address not matched

order.walletProvider
Enumeration
REQUIRED
Select the wallet provider for this interaction.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

session.version
ASCII Text
OPTIONAL
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

If session.version provided by you does not match that stored against the session, the gateway will reject the operation with error.cause=INVALID_REQUEST.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
wallet.masterpass
OPTIONAL
Information about the payer's MasterPass wallet.

wallet.masterpass.originUrl
Url
OPTIONAL
The URL of the page that will initialize the MasterPass lightbox.

Ensure that this is a valid URL according to RFC 1738.

wallet.masterpass.secondaryOriginUrl
Url
OPTIONAL
The URL of the outer or parent page that will initialize the MasterPass lightbox.

Provide this field only when the Lightbox will be invoked from a frame that's on a merchant site, and when that frame has a different domain than the merchant site.

Ensure that this is a valid URL according to RFC 1738.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
order

order.walletProvider
Enumeration
ALWAYS PROVIDED
Select the wallet provider for this interaction.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
ERROR

SUCCESS
SUCCESS

session.id
ASCII Text
ALWAYS PROVIDED
session carrying the details to be used by the operation rather than the details being provided in the request.

The payment details collected at the wallet provider will be stored against this session.

Data consists of ASCII characters

Min length: 31 Max length: 35
session.version
ASCII Text
ALWAYS PROVIDED
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

En esta página
Authentication
Request: URL Parameters
Request: Fields
Response: Fields
Response: Errors
Resources

Descargas
Glosario
FAQs
Derechos de autor © 2026 Mastercard


Pair With Wallet
Request to initiate a wallet interaction so that you can request pairing with a payer's wallet.

For the MasterPass Online wallet, use this operation to initiate a wallet interaction to ask the payer to authorize pairing. You reference the MasterPass JavaScript client library in your page, and use the response parameters from this operation when you invoke the MasterPass lightbox. The gateway will manage all of the back-end interactions with MasterCard.

For more information on pairing see - MasterPass Pairing

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
pair
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
order
REQUIRED
order

order.walletProvider
Enumeration
REQUIRED
Select the wallet provider for this interaction.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
ERROR

SUCCESS
SUCCESS

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.

Retrieve Wallet Options
Request to retrieve information from the payer's wallet before the checkout page is presented so that you can streamline the checkout process. For example, the wallet may return details about the payer's shipping address and masked card numbers that you can use to display on checkout pages.

For the MasterPass wallet, provide the Long Access Token for a paired wallet to retrieve information about that wallet.

For more information on pairing see - MasterPass Pairing

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
walletOptions
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
order
REQUIRED
order

order.walletProvider
Enumeration
REQUIRED
Select the wallet provider for this interaction.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

wallet.masterpass.longAccessToken
String
REQUIRED
A wallet token provided by the gateway for Masterpass paired accounts.

Save this token and use it in the Retrieve Wallet Options request to obtain pre-checkout data from the payer's wallet for future interactions.

Data can consist of any characters

Min length: 1 Max length: 255
Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
ERROR

SUCCESS
SUCCESS

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Retrieve Wallet Pairing Result
Request to retrieve the results of your request to pair with a payer's wallet.

For the MasterPass wallet, provide the pairingToken and the pairingVerifier returned by the MasterPass callback to retrieve the Long Access Token for a consumer's connected wallet.

For more information on pairing see - MasterPass Pairing

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
pair
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
Fields
Show optional fields 
apiOperation
String
= RETRIEVE_WALLET_PAIRING_RESULT
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
order

order.walletProvider
Enumeration
REQUIRED
Select the wallet provider for this interaction.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

wallet.masterpass
REQUIRED
Provide the details for the MasterPass Wallet.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
ERROR

SUCCESS
SUCCESS

Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.


Update Session From Wallet
This operation retrieves the payer's payment details associated with a wallet interaction.

For the MasterPass wallet, provide the oauthToken, oauthVerifier and checkoutUrl returned by the MasterPass callback to retrieve the payer's payment details associated with the MasterPass interaction.The payment details collected at MasterPass Online will be stored against the payment session identified in the request.

For the Visa Checkout wallet, provide the callId returned by the Visa Checkout Lightbox to retrieve the payer's payment details associated with the Visa Checkout interaction.

The retrieved payment details are stored against the payment session identified in the request.

POST
https://evopaymentsmexico.gateway.mastercard.com/api/rest/version/100
/
merchant
/
{merchantId}
/
session
/
{sessionId}
Authentication
This operation requires authentication via one of the following methods:


Certificate authentication.
Basic HTTP authentication as described at w3.org. Provide 'merchant.<your gateway merchant ID>' in the userid portion and your API password in the password portion.
Request
URL Parameters
{merchantId}
Alphanumeric + additional characters
REQUIRED
The unique identifier issued to you by your payment provider.


This identifier can be up to 12 characters in length.


Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
{sessionId}
ASCII Text
REQUIRED
The identifier of the payment session


Data consists of ASCII characters

Min length: 31 Max length: 35
Fields
Show optional fields 
apiOperation
String
= UPDATE_SESSION_FROM_WALLET
FIXED
Any sequence of zero or more unicode characters.

order
REQUIRED
Details of the order.

order.walletProvider
Enumeration
REQUIRED
Details about the source of the payment details used for digital payment methods.

Provide this value when you process payments for:
• Device payment methods such as Apple Pay, Android Pay, Samsung Pay, or Google Pay.
• Digital wallets such as Masterpass, Visa Checkout or Amex Express Checkout.

Value must be a member of the following list. The values are case sensitive.

AMEX_EXPRESS_CHECKOUT
Amex Express Checkout wallet provider.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

MASTERPASS_ONLINE
MasterPass Online wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

SECURE_REMOTE_COMMERCE
Secure Remote Commerce (SRC) wallet provider.

VISA_CHECKOUT
Visa Checkout wallet provider.

Response
Fields
Show conditional fields 
merchant
Alphanumeric + additional characters
ALWAYS PROVIDED
The unique identifier issued to you by your payment provider.

This identifier can be up to 12 characters in length.

Data may consist of the characters 0-9, a-z, A-Z, '-', '_'

Min length: 1 Max length: 40
order
ALWAYS PROVIDED
order

order.walletProvider
Enumeration
ALWAYS PROVIDED
Details about the source of the payment details used for digital payment methods.

Provide this value when you process payments for:
• Device payment methods such as Apple Pay, Android Pay, Samsung Pay, or Google Pay.
• Digital wallets such as Secure Remote Commerce (Click to Pay).

Value must be a member of the following list. The values are case sensitive.

APPLE_PAY
Apple Pay mobile wallet provider.

CHASE_PAY
Chase Pay wallet provider.

GOOGLE_PAY
Google Pay mobile wallet provider.

SAMSUNG_PAY
Samsung Pay mobile wallet provider.

SECURE_REMOTE_COMMERCE
Secure Remote Commerce (SRC) wallet provider.

result
Enumeration
ALWAYS PROVIDED
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
ERROR

SUCCESS
SUCCESS

session.id
ASCII Text
ALWAYS PROVIDED
session carrying the details to be used by the operation rather than the details being provided in the request.

The payment details collected at the wallet provider will be stored against this session.

Data consists of ASCII characters

Min length: 31 Max length: 35
session.version
ASCII Text
ALWAYS PROVIDED
Use this field to implement optimistic locking of the session content.

Do this if you make business decisions based on data from the session and wish to ensure that the same data is being used for the request operation.

To use optimistic locking, record session.version when you make your decisions, and then pass that value in session.version when you submit your request operation to the gateway.

See Making Business Decisions Based on Session Content.

Data consists of ASCII characters

Min length: 10 Max length: 10
Errors
error
Information on possible error conditions that may occur while processing an operation using the API.

error.cause
Enumeration
Broadly categorizes the cause of the error.

For example, errors may occur due to invalid requests or internal system failures.

Value must be a member of the following list. The values are case sensitive.

INVALID_REQUEST
The request was rejected because it did not conform to the API protocol.

REQUEST_REJECTED
The request was rejected due to security reasons such as firewall rules, expired certificate, etc.

SERVER_BUSY
The server did not have enough resources to process the request at the moment.

SERVER_FAILED
There was an internal system failure.

error.explanation
String
Textual description of the error based on the cause.

This field is returned only if the cause is INVALID_REQUEST or SERVER_BUSY.

Data can consist of any characters

Min length: 1 Max length: 1000
error.field
String
Indicates the name of the field that failed validation.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Data can consist of any characters

Min length: 1 Max length: 100
error.supportCode
String
Indicates the code that helps the support team to quickly identify the exact cause of the error.

This field is returned only if the cause is SERVER_FAILED or REQUEST_REJECTED.

Data can consist of any characters

Min length: 1 Max length: 100
error.validationType
Enumeration
Indicates the type of field validation error.

This field is returned only if the cause is INVALID_REQUEST and a field level validation error was encountered.

Value must be a member of the following list. The values are case sensitive.

INVALID
The request contained a field with a value that did not pass validation.

MISSING
The request was missing a mandatory field.

UNSUPPORTED
The request contained a field that is unsupported.

result
Enumeration
A system-generated high level overall result of the operation.

Value must be a member of the following list. The values are case sensitive.

ERROR
The operation resulted in an error and hence cannot be processed.
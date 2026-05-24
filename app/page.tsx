import Script from "next/script";
import PortfolioPage from "../components/PortfolioPage";

function buildContactScript(accessKey: string) {
  return `
    (function () {
      const web3FormsAccessKey = ${JSON.stringify(accessKey)};

      function setButtonState(loading) {
        const button = document.getElementById("fb");
        if (!button) return;
        button.disabled = loading;
        button.textContent = loading ? "Sending..." : "Send Message ->";
      }

      function setNotice(message, isSuccess) {
        const notice = document.getElementById("fok");
        if (!notice) return;
        notice.style.display = "block";
        notice.style.color = isSuccess ? "#22c55e" : "#facc15";
        notice.textContent = message;
      }

      function fallbackToMailto(name, email, subject, message) {
        const mailto = "mailto:rijankanxo111@gmail.com"
          + "?subject=" + encodeURIComponent(subject)
          + "&body=" + encodeURIComponent(
              "Hi Rijan,\\n\\n"
              + "My name is " + name + " (" + email + ").\\n\\n"
               + "This message was sent from your portfolio contact form.\\n\\n"
              + message
            );

        window.location.href = mailto;
      }

      async function handleSubmit(event) {
        event.preventDefault();

        const name = document.getElementById("fn")?.value?.trim() ?? "";
        const email = document.getElementById("fe")?.value?.trim() ?? "";
        const subject = document.getElementById("fs")?.value?.trim() ?? "";
        const message = document.getElementById("fm")?.value?.trim() ?? "";

        if (!name || !email || !subject || !message) {
          return;
        }

        if (!web3FormsAccessKey) {
          setNotice("No form key is configured yet, so your mail app will open instead.", false);
          fallbackToMailto(name, email, subject, message);
          return;
        }

        setButtonState(true);

        try {
          const brandedSubject = 'Portfolio message: ' + subject;

          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              access_key: web3FormsAccessKey,
              name,
              email,
              subject: brandedSubject,
              message,
              from_name: 'Rijan Kapur Poudel Portfolio',
              replyto: email,
              source: 'Portfolio contact form',
              note: 'This inquiry came from the portfolio site and should feel personal.'
            })
          });

          const contentType = response.headers.get('content-type') || '';
          const result = contentType.includes('application/json')
            ? await response.json()
            : { message: await response.text() };

          if (!response.ok || !result.success) {
            throw new Error(result?.message || 'Web3Forms rejected the submission.');
          }

          const form = document.getElementById("cf");
          if (form && "reset" in form) {
            form.reset();
          }

          setNotice("Message sent successfully. I'll get back to you soon.", true);
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : 'Web3Forms request failed.';
          setNotice(errorMessage, false);

          if (/network|fetch/i.test(errorMessage)) {
            fallbackToMailto(name, email, subject, message);
          }
        } finally {
          setButtonState(false);
        }
      }

      function attachForm() {
        const form = document.getElementById("cf");
        if (!form || form.dataset.contactBound === "true") return;
        form.dataset.contactBound = "true";
        form.addEventListener("submit", handleSubmit);
      }

      attachForm();
      window.addEventListener("load", attachForm);
    })();
  `;
}

export default function HomePage() {
  const contactScript = buildContactScript(
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? ""
  );

  return (
    <>
      <PortfolioPage />
      <Script id="portfolio-behavior" src="portfolio.js" strategy="afterInteractive" />
      <Script id="portfolio-contact" strategy="afterInteractive">
        {contactScript}
      </Script>
    </>
  );
}

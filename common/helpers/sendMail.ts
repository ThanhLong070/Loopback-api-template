export const EMAIL_FROM = 'contact@ql6625.fr';

export async function sendMail(Email: any, { to, from, subject, text, html, attachments }: {
    to: string | string[],
    from?: string | string[],
    subject: string | string[],
    text?: string,
    html?: string
    attachments?: {
        filename: string,
        path: string,
        contentType: string
    }[]
}) {
    return new Promise((resolve, reject) => {
        Email.send({
            to: to,
            from: from || EMAIL_FROM,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments
        }, function (err: Error, mail: any) {
            err ? reject(err) : resolve(mail);
        });
    });
}

export async function sendMdpPerdu(Email: any, info: any) {

    const BOUrl = 'https://backoffice.mobilisation.ql6625.fr';
    const resetLink = `${BOUrl}/reset-password?access_token=${info.accessToken.id}`;

    const html = `<p><b>Vous venez de demander de changer le mot de passe de votre compte Mobman. Veuillez cliquer sur le bouton ci-dessous pour confirmer et continuer:</b></p>
<p><a target="_blank" href="${resetLink}">${resetLink}</a></p>
<p>Si vous n’avez pas sollicité ce changement, ignorez cet email ou veuillez nous prévenir.</p>
<p>Merci</p>
<p>Cordialement.</p> 
<p>L’équipe Mobman.</p>`;


    return sendMail(Email, {
        to: info.email,
        subject: 'Mot de passe perdu',
        html: html
    })
        .catch((error) => {
            console.log(error);
        });
}

export async function sendCreateAccount(Email: any, info: any) {

    const html = `<p> Salut ${[info.nom, info.prenom].join(' ')}</p>
<p>Votre compte a été créé à Mobman. Votre identifiant: <b> nom d'utilisateur : ${info.username} - mot de passe : ${info.password}</b></p>
<p>Merci</p>
<p>Cordialement.</p> 
<p>L’équipe Mobman.</p>`;


    return sendMail(Email, {
        to: info.email,
        subject: 'Votre compte',
        html: html
    })
        .catch((error) => {
            console.log(error);
        });
}

export async function sendUpdateSettingMail(Email: any, info: any) {

    const html = `<p><b>Vous venez de demander de changer le mot de passe de votre compte Mobman. Veuillez cliquer sur le bouton ci-dessous pour confirmer et continuer:</b></p>
<p><a target="_blank"</a></p>
<p>Si vous n’avez pas sollicité ce changement, ignorez cet email ou veuillez nous prévenir.</p>
<p>Merci</p>
<p>Cordialement.</p> 
<p>L’équipe Mobman.</p>`;


    return sendMail(Email, {
        to: info.email,
        subject: 'Mot de passe perdu',
        html: html
    })
        .catch((error) => {
            console.log(error);
        });
}








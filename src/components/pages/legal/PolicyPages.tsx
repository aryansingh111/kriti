import { Link } from 'react-router'
import { paths } from '@/lib/routes'
import { LegalPage, type LegalDoc } from './LegalPage'
import { List, P } from './legalParts'

const UPDATED = '21 October 2026'

const A = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
    {children}
  </Link>
)
const B = ({ children }: { children: React.ReactNode }) => <b className="font-bold text-ink">{children}</b>

/* ─────────── privacy ─────────── */

const PRIVACY: LegalDoc = {
  label: 'Policy',
  title: 'Privacy Policy',
  sub: 'Kriti works inside your browser. Your resume is yours, and we never receive it.',
  updated: UPDATED,
  summary: [
    'Your resume, photo and details stay on your device. They are never uploaded to us.',
    'There is no sign-up, no account, no advertising and no tracking.',
    'We only see what you choose to send us, such as a bug report you email.',
  ],
  sections: [
    {
      id: 'about',
      title: 'About this policy',
      body: (
        <>
          <P>Kriti is a free resume builder for students, freshers and professionals. This policy explains what happens to information when you use the Kriti website, in plain words.</P>
          <P>
            It applies to every page of the site. It should be read with our <A to={paths.terms}>Terms of Use</A> and our <A to={paths.cookies}>Cookies and Storage</A> page.
          </P>
        </>
      ),
    },
    {
      id: 'stays',
      title: 'What stays on your device',
      body: (
        <>
          <P>Everything you type into Kriti is processed by your own browser. This includes:</P>
          <List
            items={[
              'your name, contact details, links, education, experience, skills and every other resume field,',
              'the photo you upload, which is shrunk and kept as part of your resume on your device,',
              'the job description you paste into the Check panel to match keywords, which is saved with that resume,',
              'your design choices, such as template, colours and fonts.',
            ]}
          />
          <P>
            The PDF is built in your browser too. Nothing is sent to a server to make it. Because of this, we <B>cannot read, recover or delete</B> your resumes for you. If you clear your browser data, they are gone unless you saved a backup file.
          </P>
        </>
      ),
    },
    {
      id: 'collect',
      title: 'What we collect',
      body: (
        <>
          <P>
            <B>Nothing from your resume.</B> Kriti has no accounts and no database of users. The site does not use analytics, advertising, tracking pixels or social-media plug-ins, and it does not set cookies.
          </P>
          <P>The only information that can reach us is what you decide to send:</P>
          <List
            items={[
              <>
                <B>Bug reports and feature requests.</B> The feedback form prepares an email in your own email app. Nothing is sent until you press send in that app. You can see the full message first, and you choose whether to add basic browser details (browser name, screen size and theme). Your resume is never attached.
              </>,
              <>
                <B>Your email address</B>, only if you type it into the form so that we can reply, and only inside that email.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: 'hosting',
      title: 'Hosting and server logs',
      body: (
        <>
          <P>
            Like any website, Kriti is served by a hosting provider. When your browser loads the site, the host may automatically record technical details such as your IP address, the time of the request and the page asked for. These logs are used to keep the site secure and running, and they never include anything you type into Kriti.
          </P>
          <P>All fonts and images are served from the Kriti site itself. The site does not load fonts or scripts from other companies.</P>
        </>
      ),
    },
    {
      id: 'use',
      title: 'How we use information',
      body: (
        <>
          <P>When you send us a report or a message, we use it only to read it, fix the problem, consider the idea, and reply to you if you asked us to. We do not sell it, rent it or use it for marketing.</P>
          <P>We do not make decisions about you with automated tools, and we do not build profiles.</P>
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Sharing',
      body: (
        <>
          <P>We do not share your information with anyone, because we do not hold your resume. The one exception is where the law requires us to disclose something we hold, which would only ever be a report you emailed to us.</P>
          <P>
            If you download a PDF and give it to an employer, a job portal or anyone else, that is your choice, and their privacy policy applies to what they do with it. Resumes usually contain a phone number, an email address and sometimes a photo, so share them with care.
          </P>
        </>
      ),
    },
    {
      id: 'control',
      title: 'Your choices and rights',
      body: (
        <>
          <P>Because your data is on your device, you are in control of it:</P>
          <List
            items={[
              <>
                <B>See and keep it:</B> use <B>Export data (.json)</B> in the editor&rsquo;s menu to save a backup file of your resume.
              </>,
              <>
                <B>Delete it:</B> delete a resume from My resumes, or clear this site&rsquo;s data in your browser settings to remove everything.
              </>,
              <>
                <B>Messages you sent us:</B> write to us through the <A to={paths.feedback()}>feedback page</A> and ask to see or delete them. Under the Digital Personal Data Protection Act, 2023, you may ask to access, correct or erase personal data we hold about you, and we will respond within a reasonable time.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: 'security',
      title: 'Keeping your information safe',
      body: (
        <>
          <P>The site is delivered over an encrypted connection (HTTPS). Since your resume never leaves your browser, it cannot be leaked from our side.</P>
          <P>
            It is saved on your device without a password, like any other website data. Anyone who can use your browser profile, such as on a shared or public computer, could open your saved resumes. Please <B>delete your resumes and clear site data</B> before you leave a shared computer.
          </P>
        </>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: (
        <P>Kriti is made for students and is meant for people who can use a computer on their own to prepare a resume. We do not knowingly collect personal data from anyone, children included. If you are under 18, please ask a parent or teacher to help you decide what to put on your resume, since it will be shared with others.</P>
      ),
    },
    {
      id: 'changes',
      title: 'Changes and contact',
      body: (
        <>
          <P>If we change how Kriti handles information, we will update this page and the date at the top. If a change would matter to you, we will say so on the home page.</P>
          <P>
            Questions about privacy? Use the <A to={paths.feedback()}>feedback page</A> and mention &ldquo;privacy&rdquo; in the title.
          </P>
        </>
      ),
    },
  ],
}

/* ─────────── terms ─────────── */

const TERMS: LegalDoc = {
  label: 'Policy',
  title: 'Terms of Use',
  sub: 'The simple rules for using Kriti. By using the site you agree to them.',
  updated: UPDATED,
  summary: [
    'Kriti is free to use. You own the resumes you make.',
    'You are responsible for what your resume says, and it must be true.',
    'We do not promise a job, an interview or a particular result from any employer system.',
  ],
  sections: [
    {
      id: 'agree',
      title: 'Using Kriti',
      body: (
        <>
          <P>These terms are an agreement between you and Kriti. By opening or using the website, you accept them. If you do not agree, please do not use the site.</P>
          <P>
            Please also read our <A to={paths.privacy}>Privacy Policy</A> and <A to={paths.cookies}>Cookies and Storage</A> page, which explain how your information is handled.
          </P>
        </>
      ),
    },
    {
      id: 'service',
      title: 'What Kriti offers',
      body: (
        <>
          <P>Kriti lets you choose a resume template, enter your details, adjust the design and download the result as a PDF. It is free. There is no account, no watermark and no limit on downloads.</P>
          <P>We may add, change or remove features, templates or pages at any time, and we may pause the site for maintenance. We try to avoid this, but we do not promise the site will always be available.</P>
        </>
      ),
    },
    {
      id: 'yours',
      title: 'Your content and your resumes',
      body: (
        <>
          <P>
            You own what you write, the photo you add and the PDFs you create. We claim no rights over them, and since they stay on your device, we never receive a copy. You are free to use your downloaded resumes anywhere, for any job application.
          </P>
          <P>You confirm that the details and the photo you put on your resume are yours to use, and that you are not using another person&rsquo;s name, photo or work as your own.</P>
        </>
      ),
    },
    {
      id: 'duties',
      title: 'What you agree to do',
      body: (
        <>
          <P>Please use Kriti honestly. You agree not to:</P>
          <List
            items={[
              'put false or misleading information on a resume, such as fake degrees, employers or dates, or claim to be someone else,',
              'use the site to break any law, or to harass, defame or harm anyone,',
              'try to break, overload or gain unauthorised access to the site or its hosting,',
              'copy the site in bulk with automated tools, or sell or pass off the Kriti site, its design or its templates as your own product.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'ours',
      title: 'Our work',
      body: (
        <>
          <P>The Kriti name, logo, site design, templates, layouts and sample content are ours or are used with permission, and are protected by copyright and other laws. The sample resumes use made-up people and are only there to show how a template looks. Any resemblance to a real person is by chance.</P>
          <P>
            You may use the templates to make your own resumes. That is the whole purpose. You may not resell the templates themselves. Fonts are open-source fonts used under their own licences. Our <A to={paths.feedback()}>feedback page</A> is the way to ask about any other use.
          </P>
        </>
      ),
    },
    {
      id: 'results',
      title: 'No promise of jobs or results',
      body: (
        <>
          <P>
            Kriti helps you present yourself well, but a resume is only one part of a job search. <B>We do not guarantee</B> that any resume will get an interview, a job or a response.
          </P>
          <P>
            Features such as the strength score, the ATS note and the keyword match are simple guides built on common good practice. Every employer and every applicant tracking system works differently, so they are <B>not a promise</B> that a resume will pass any particular system. Please read your final PDF carefully, check spelling and facts, and make sure it looks right before you send it.
          </P>
        </>
      ),
    },
    {
      id: 'backup',
      title: 'Saving your work',
      body: (
        <P>
          Your resumes are saved in your browser only. They can be lost if you clear your browser data, change browser or device, or use private browsing. Please use <B>Export data (.json)</B> and keep downloaded PDFs somewhere safe. We cannot restore resumes for you.
        </P>
      ),
    },
    {
      id: 'liability',
      title: 'Warranty and liability',
      body: (
        <>
          <P>Kriti is provided &ldquo;as it is&rdquo; and &ldquo;as available&rdquo;, as a free service, without promises of any kind about it being error-free, uninterrupted or suited to a particular purpose.</P>
          <P>
            To the extent the law allows, Kriti and the people who make it are not responsible for losses that come from using, or not being able to use, the site. This includes lost data, a missed opportunity, or a decision an employer makes about your resume. Nothing in these terms limits any right you have under law that cannot be limited.
          </P>
        </>
      ),
    },
    {
      id: 'links',
      title: 'Other websites',
      body: <P>The links you add to your resume, and any links on the site, may lead to other websites. We do not control them and are not responsible for what they contain or how they handle your information.</P>,
    },
    {
      id: 'law',
      title: 'Changes, law and contact',
      body: (
        <>
          <P>We may update these terms from time to time. The date at the top shows the latest version, and using Kriti after a change means you accept it.</P>
          <P>These terms are governed by the laws of India. Any dispute that cannot be settled by talking it through will be handled by the courts of India that have jurisdiction.</P>
          <P>
            Questions or complaints? Please write to us from the <A to={paths.feedback()}>feedback page</A>.
          </P>
        </>
      ),
    },
  ],
}

/* ─────────── cookies and storage ─────────── */

const COOKIES: LegalDoc = {
  label: 'Policy',
  title: 'Cookies and Storage',
  sub: 'Kriti sets no cookies. It saves your work in your own browser, and here is exactly what that means.',
  updated: UPDATED,
  summary: [
    'No cookies, no tracking and no advertising storage.',
    'Your resumes, theme and preview pictures are saved on your device so you do not lose your work.',
    'You can clear all of it at any time from your browser settings.',
  ],
  sections: [
    {
      id: 'cookies',
      title: 'Cookies',
      body: (
        <>
          <P>
            Kriti does <B>not</B> set or read cookies. There are no analytics cookies, advertising cookies or social-media cookies. Because of this, there is no cookie banner to accept.
          </P>
        </>
      ),
    },
    {
      id: 'storage',
      title: 'What Kriti saves in your browser',
      body: (
        <>
          <P>To work as an app that remembers your resumes, Kriti uses your browser&rsquo;s own storage. This stays on your device and is never sent to us.</P>
          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead className="bg-surface-2 text-[12px] font-bold uppercase tracking-[0.1em] text-faint">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Where</th>
                  <th className="px-4 py-3">What it holds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top text-muted">
                <tr>
                  <td className="px-4 py-3.5 font-mono text-[13px] font-semibold text-ink">kriti:v2</td>
                  <td className="px-4 py-3.5">Local storage</td>
                  <td className="px-4 py-3.5">Your resumes (text, photo, design settings and any job description you pasted into Check) and which one is open.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-mono text-[13px] font-semibold text-ink">kriti:theme</td>
                  <td className="px-4 py-3.5">Local storage</td>
                  <td className="px-4 py-3.5">Whether you chose light, dark or system theme.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-mono text-[13px] font-semibold text-ink">Preview pictures</td>
                  <td className="px-4 py-3.5">IndexedDB</td>
                  <td className="px-4 py-3.5">Small template and resume preview images, saved so pages open faster. They can be remade at any time.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>All of these are needed for Kriti to work as you expect, which is why they are used without asking. None of them identify you, and none are used to track you across other websites.</P>
        </>
      ),
    },
    {
      id: 'clear',
      title: 'Clearing it',
      body: (
        <>
          <P>
            You can remove one resume from <A to={paths.resumes}>My resumes</A>, or remove everything by clearing this site&rsquo;s data in your browser settings (look for &ldquo;Cookies and site data&rdquo; and delete the data for this site). Doing so removes all saved resumes for good, so save a backup first with <B>Export data (.json)</B> if you want to keep them.
          </P>
          <P>If you use a shared or public computer, please do this before you leave. Private or incognito windows delete this data when the window closes.</P>
        </>
      ),
    },
    {
      id: 'third',
      title: 'Other companies',
      body: <P>Kriti does not load scripts, fonts, maps or videos from other companies, so no other company sets storage in your browser through this site. If that ever changes, we will update this page first.</P>,
    },
    {
      id: 'questions',
      title: 'Questions',
      body: (
        <P>
          See our <A to={paths.privacy}>Privacy Policy</A> for the full picture, or write to us from the <A to={paths.feedback()}>feedback page</A>.
        </P>
      ),
    },
  ],
}

export const PrivacyPage = () => <LegalPage doc={PRIVACY} />
export const TermsPage = () => <LegalPage doc={TERMS} />
export const CookiesPage = () => <LegalPage doc={COOKIES} />

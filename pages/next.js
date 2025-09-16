import Head from 'next/head';

export default function NextPage() {
  return (
    <>
      <Head>
        <title>Next Step - AI Teacher Assessment</title>
      </Head>
      <div className="assessment-theme-bg">
        <div className="assessment-container">
          <h1 className="assessment-title">Next Step</h1>
          <p className="assessment-subtitle">Continue your personalised AI Teacher Assessment.</p>
          <hr className="assessment-divider" />
          <div className="assessment-welcome">
            <h2>Coming Soon</h2>
            <p>This is a placeholder for the next step in your assessment. You can add your next form fields here.</p>
          </div>
        </div>
      </div>
    </>
  );
}

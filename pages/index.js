import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Assessment Customization Guide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container">
        <h1>AI Assessment Customization Guide</h1>
        <form className="customization-form">
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <label>
            Email:
            <input type="email" name="email" />
          </label>
          <label>
            Assessment Type:
            <select name="assessmentType">
              <option value="quiz">Quiz</option>
              <option value="project">Project</option>
              <option value="presentation">Presentation</option>
            </select>
          </label>
          <label>
            Customization Details:
            <textarea name="details" rows="4" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

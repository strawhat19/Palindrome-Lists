import { Link } from 'expo-router';
import Header from '../Header/index.web';
import Footer from '../Footer/index.web';
import PageMetadata from '../PageMetadata';
import useSubmissionPage from './useSubmissionPage';
import useContentPage from '../ContentPage/useContentPage.web';
import '../LandingPage/styles.scss';
import './styles.scss';
const SubmissionPage = () => {
  const draft = useSubmissionPage();
  const shell = useContentPage(`submit`);
  return <div id='submission-page' className='palindrome-landing submission-page' ref={shell.rootRef} style={shell.themeStyle} data-theme={shell.theme}>
    <PageMetadata page='submit' /><Header scrolled={shell.scrolled} />
    <main className='submission-main' id='submission-main'><p className='submission-eyebrow'>A little discovery of your own</p><h1>Check your palindrome.</h1><p>Try a word, name, or phrase before the future submission flow opens. This checks letters locally, not originality, attribution, or editorial suitability.</p>
      <form onSubmit={(event) => { event.preventDefault(); draft.check(); }} className='submission-form'>
        <label htmlFor='submission-text'>Your palindrome</label><textarea id='submission-text' value={draft.text} onChange={(event) => draft.setText(event.target.value)} maxLength={500} placeholder='Never odd or even' aria-describedby='submission-hint' rows={4} />
        <p id='submission-hint'>English A–Z only. Spaces, capitalization, and common punctuation are ignored. Your draft stays in this page’s memory and disappears when you leave.</p>
        <div className='submission-actions'><button type='submit'>Check Draft</button><button type='button' onClick={draft.clear}>Clear Draft</button></div>
        <p role='status' aria-live='polite'>{draft.result?.message}</p><button type='button' disabled>Submit for Approval · Not Connected</button>
      </form>
      <p>No submission has been sent, saved to an account, or published.</p><nav className='submission-actions'><Link href='/guidelines'>Submission guidelines</Link><Link href='/submissions'>Your submissions</Link><Link href='/palindromes'>Browse the collection</Link></nav>
    </main><Footer />
  </div>;
export default SubmissionPage;

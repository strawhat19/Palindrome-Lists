import { Link, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import PageMetadata from '../PageMetadata';
import Header from '../Header/index.web';
import Footer from '../Footer/index.web';
import WebAnchor from '../WebAnchor/index.web';
import ScrollToTop from '../ScrollToTop/index.web';
import useAccountPage from './useAccountPage';
import useContentPage from '../ContentPage/useContentPage.web';
import { accountPages, type AccountPageKey } from '../../shared/account/navigation';
import { useTheme } from '../../shared/themeContext/useTheme';
import '../LandingPage/styles.scss';
import './styles.scss';

const AccountPageView = ({ page }: { page: AccountPageKey }) => {
  const state = useAccountPage(page);
  const { theme, toggleTheme } = useTheme();
  const shell = useContentPage(page);
  const [collapsed, setCollapsed] = useState(false);
  const [groups, setGroups] = useState<string[]>([`Your space`, `Owner workspace`]);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(`palindrome-layout-preview-collapsed`) === `true`);
      const saved: unknown = JSON.parse(localStorage.getItem(`palindrome-layout-preview-groups`) ?? `null`);
      if (Array.isArray(saved)) setGroups(saved.filter((item): item is string => item === `Your space` || item === `Owner workspace`));
    } catch {}
    const header = document.getElementById(`site-header`);
    if (!header) return;
    const measure = () => shell.rootRef.current?.style.setProperty(`--account-header-height`, `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [shell.rootRef]);
  const toggleSidebar = () => setCollapsed((current) => {
    try { localStorage.setItem(`palindrome-layout-preview-collapsed`, String(!current)); } catch {}
    return !current;
  });
  const toggleGroup = (group: string) => setGroups((current) => {
    const next = current.includes(group) ? current.filter((item) => item !== group) : [...current, group];
    try { localStorage.setItem(`palindrome-layout-preview-groups`, JSON.stringify(next)); } catch {}
    return next;
  });
  return (
    <div ref={shell.rootRef} style={shell.themeStyle} data-theme={theme} id={`account-page-${page}`} className={`palindrome-landing account-page${collapsed ? ` account-page--collapsed` : ``}`}>
      <PageMetadata page={page} />
      <a className='skip-link' href='#account-main'>Skip to Account Content</a>
      <Header scrolled={shell.scrolled} />
      <div id='account-layout' className='account-layout'>
        <aside id='account-sidebar' className='account-sidebar' aria-label='Account layout preview navigation'>
          <p className='account-sidebar-caption'>Layout preview</p>
          <nav className='account-sidebar-body'>
            {[`Your space`, `Owner workspace`].map((group, index) => (
              <section key={group} id={`account-group-${index}`} className='account-nav-group'>
                <button type='button' className='account-group-toggle' aria-expanded={groups.includes(group)} aria-controls={`account-group-links-${index}`} onClick={() => toggleGroup(group)}>
                  <Icon name={index ? `shield` : `user`} /><span>{group}</span><Icon name='chevron' size={14} />
                </button>
                <div id={`account-group-links-${index}`} className='account-group-links' hidden={!groups.includes(group)}>
                  {Object.entries(accountPages).filter(([, item]) => item.group === group).map(([key, item]) => (
                    <Link key={key} href={item.path as Href} asChild><WebAnchor id={`account-nav-${key}`} className='account-nav-link' title={`${item.label} layout preview`} aria-current={page === key ? `page` : undefined}><Icon name={item.icon} size={16} /><span>{item.label}</span></WebAnchor></Link>
                  ))}
                </div>
              </section>
            ))}
          </nav>
          <div className='account-sidebar-bottom'>
            <Link href='/profile' asChild><WebAnchor className='account-identity'><span className='account-avatar' aria-hidden='true'>?</span><span>Not signed in</span></WebAnchor></Link>
            <button type='button' onClick={toggleSidebar} aria-label={collapsed ? `Expand Sidebar` : `Collapse Sidebar`} aria-expanded={!collapsed}><Icon name='menu' /></button>
          </div>
        </aside>
        <main id='account-main' className='account-main' tabIndex={-1}>
          <section ref={shell.heroRef} className='account-heading'>
            <p className='account-eyebrow'>Your little corner of wordplay</p>
            <h1 id={`content-title-${page}`} tabIndex={-1}>{state.page.title}</h1>
            <p className='account-muted'>A familiar space for your details, discoveries, and collection.</p>
          </section>
          <section className='account-panel account-connection' aria-labelledby='account-connection-title'>
            <Icon name='shield' size={24} />
            <div><h2 id='account-connection-title'>Sign in to view this</h2><p>{state.account.status === `unconfigured` ? state.account.message : `Account access is unavailable in this frontend build.`}</p><p>Owner pages will require trusted server authorization. Previewing a layout does not sign you in or grant a role.</p>
              <div className='account-actions'><Link href='/signin' asChild><WebAnchor className='account-button'>Sign in</WebAnchor></Link><Link href='/signup' asChild><WebAnchor className='account-button account-button--soft'>Sign up</WebAnchor></Link><button type='button' className='account-button account-button--soft' onClick={() => state.setPreview(!state.preview)} aria-expanded={state.preview} aria-controls='account-preview'>{state.preview ? `Hide Layout Preview` : `Preview Layout`}</button></div>
            </div>
          </section>
          {state.preview && <section id='account-preview' aria-label='Disconnected layout preview'>
            <p className='account-preview-label'>Design preview only · No accounts, activity, or live reports</p>
            {page === `profile` ? <div className='account-profile-grid'>
              <section className='account-panel'><h2>Profile details</h2><div className='account-profile-identity'><span className='account-avatar account-avatar--large'>?</span><div><h3>Your avatar</h3><p className='account-muted'>Your Google photo or name initial will appear after sign-in.</p></div></div>
                <label className='account-field'>Display name<input disabled placeholder='Available after sign-in' /></label>
                <label className='account-field'>Email address<input disabled type='email' placeholder='Available after sign-in' /></label>
                <label className='account-field'>Profile visibility<select disabled defaultValue='private'><option value='private'>Private</option></select></label>
                <button disabled className='account-button'>Save Profile · Not Connected</button>
              </section>
              <aside className='account-panel account-profile-meta'><h2>Account</h2><dl><dt>Role</dt><dd>Not assigned</dd><dt>Status</dt><dd>Not signed in</dd><dt>Joined</dt><dd>Unavailable</dd></dl><h3>Appearance</h3><button type='button' className='account-button account-button--soft' onClick={toggleTheme}><Icon name={theme === `dark` ? `sun` : `moon`} />{theme === `dark` ? `Light` : `Dark`} Mode</button><p className='account-muted'>Theme is a device preference, not an account update.</p></aside>
            </div> : page === `favorites` ? <section className='account-panel account-empty'><Icon name='save' size={32} /><h2>Your favorites will live here</h2><p>Saved items cannot load until sign-in and Firestore are connected. This is not an empty account result.</p><Link href='/palindromes'>Explore palindromes</Link></section>
            : page === `submissions` ? <section className='account-panel account-empty'><Icon name='quote' size={32} /><h2>From first draft to published palindrome</h2><p>Your future submissions will show Pending, Approved, or Needs Changes after a reviewer checks them.</p><Link href='/submit'>Try the local draft checker</Link><p>No draft is sent to moderation in this build.</p></section>
            : page === `analytics` ? <section className='account-panel account-report'><h2>Website traffic & runtime health</h2><div className='account-stats'>{[`Visitors`, `Page views`, `Requests`].map((label) => <div key={label}><span>{label}</span><strong>—</strong><small>Not connected</small></div>)}</div><div className='account-report-empty'><Icon name='code' size={32} /><h3>Reporting unavailable</h3><p>No Vercel reporting source is connected. No sample activity or simulated chart is shown.</p></div><button disabled className='account-button'>Refresh · Not Connected</button></section>
            : <><div className='account-stats'>{[`Users`, `Pending submissions`, `Published entries`].map((label) => <div className='account-panel' key={label}><span>{label}</span><strong>—</strong><small>Live data unavailable</small></div>)}</div><section className='account-panel'><h2>{page === `admin` ? `Submission review` : `Recent collection activity`}</h2><p className='account-muted'>Owner-only data will be loaded through authorized services after connection.</p><div className='account-table-wrap'><table><caption>Disconnected moderation table preview</caption><thead><tr>{[`No.`, `Palindrome`, `Category`, `Status`, `Actions`].map((label) => <th key={label} scope='col'>{label}</th>)}</tr></thead><tbody><tr><td colSpan={5}><span className='rowStatus'><span className='statusDotWrap'><span className='statusDot' /></span><span className='statusText'>Not connected. No records have been loaded.</span></span></td></tr></tbody></table></div><button disabled className='account-button'>Review Submissions · Not Connected</button></section></>}
          </section>}
        </main>
      </div>
      <div className='account-footer'><Footer /></div>
      <ScrollToTop visible={shell.showScrollTop} onPress={shell.scrollToTop} />
    </div>
  );
};
const AccountPage = ({ page = `profile` }: { page?: AccountPageKey }) => <AccountPageView key={page} page={page} />;
export default AccountPage;

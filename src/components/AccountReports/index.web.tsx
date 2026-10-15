import { useState } from 'react';
import Icon from '../Icon';
import { reportDefinitions, reportingMessage, type ReportKey } from '../../shared/account/reporting';
import './styles.scss';

const AccountReports = ({ compact = false }: { compact?: boolean }) => {
  const [selected, setSelected] = useState<ReportKey>(`traffic`);
  const reports: ReportKey[] = compact ? [`traffic`, `runtime`] : [selected];
  return <div id='account-reporting' className='account-reporting'>
    {!compact && <div className='account-report-switch' aria-label='Report layout selection'>
      {(Object.keys(reportDefinitions) as ReportKey[]).map((key) => <button key={key} id={`account-report-select-${key}`} type='button' aria-pressed={selected === key} onClick={() => setSelected(key)} className='account-button account-button--soft'>{reportDefinitions[key].title}</button>)}
    </div>}
    {reports.map((key) => <section key={key} id={`account-report-${key}`} className={`account-panel account-report-panel${compact ? ` account-report-panel--compact` : ``}`} aria-labelledby={`account-report-title-${key}`}>
      <div className='account-report-heading'><h2 id={`account-report-title-${key}`}><Icon name={key === `traffic` ? `eye` : `code`} />{reportDefinitions[key].title}</h2><div className='account-report-actions'><button disabled className='account-button account-button--soft'><Icon name='repeat' />Refresh</button><button disabled className='account-button account-button--soft'><Icon name='share' />Export JSON</button></div></div>
      <div className='account-report-tabs' aria-label='Unavailable report views'>{reportDefinitions[key].tabs.map((tab) => <button key={tab} id={`account-report-${key}-view-${tab.toLowerCase()}`} disabled type='button'>{tab}</button>)}</div>
      <div className='account-report-toolbar'>
        <label>Period<select id={`account-report-${key}-period`} disabled defaultValue='30'><option value='30'>30 Days · Not Connected</option></select></label>
        <label>Metric<select id={`account-report-${key}-metric`} disabled defaultValue={reportDefinitions[key].metrics[0]}>{reportDefinitions[key].metrics.map((metric) => <option key={metric}>{metric}</option>)}</select></label>
        <div className='account-report-actions'><button disabled type='button'>Chart</button><button disabled type='button'>List</button></div>
      </div>
      <div className='account-report-viewport'>
        {!compact && <fieldset disabled className='account-report-filters'><legend>Reporting range and filters · unavailable</legend><label>From<input id={`account-report-${key}-from`} type='date' /></label><label>To<input id={`account-report-${key}-to`} type='date' /></label><button type='button'>Apply</button>{(key === `traffic` ? [`Country`, `Source`, `Page`, `Device`] : [`Route`, `Status`]).map((filter) => <label key={filter}>{filter}<select defaultValue=''><option value=''>Unavailable</option></select></label>)}</fieldset>}
        <div className='account-stats'>{reportDefinitions[key].metrics.map((metric) => <div key={metric} id={`account-report-${key}-${metric.toLowerCase().replaceAll(` `, `-`)}`}><span>{metric}</span><strong aria-label='Unavailable'>—</strong><small>Not connected</small></div>)}</div>
        <div className='account-report-empty'><Icon name='shield' size={28} /><h3>Reporting unavailable</h3><p>{reportingMessage}</p><p>Source: unavailable · Last refreshed: never · Coverage: unavailable</p></div>
      </div>
    </section>)}
  </div>;
};
export default AccountReports;

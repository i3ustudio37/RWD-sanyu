import { YearRecord, CalendarEvent } from './types';

// Initial Calendar Events (Sample data to populate the calendar)
export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', date: new Date().toISOString().split('T')[0], title: '球隊練習', time: '16:00 - 17:30', type: 'practice' },
  { 
    id: '2026-edu-1', 
    date: '2026-01-03', 
    title: '台北市教育盃', 
    time: '08:00 - 17:00', 
    type: 'competition',
    location: '台北市永春高中'
  },
  { 
    id: '2026-edu-2', 
    date: '2026-01-04', 
    title: '台北市教育盃', 
    time: '08:00 - 17:00', 
    type: 'competition',
    location: '台北市永春高中'
  },
];

// Helper to categorize championships based on keywords
// Order priority: National > Education > Other is handled in the component sorting logic, 
// but we assign categories here.
export const INITIAL_RECORDS: YearRecord[] = [
  {
    id: '114',
    academicYear: '114',
    coaches: '總教練：陳竑文 | 教練群：王馨婉、劉雯綺',
    description: '五年級4位/四年級1位/二年級一位，期待各方好漢加入。成熟期，漸漸嶄露頭角。',
    achievements: [
      { id: '114-1', title: '台北市中正盃 國小組', rank: '第三名、第七名', category: 'Other' }
    ]
  },
  {
    id: '113',
    academicYear: '113',
    coaches: '總教練：陳竑文 | 教練群：劉雯綺、李宜瑾',
    description: '三玉國小滾球場重建。球隊重新招生，五年級一位/四年級三位/三年級二位/二年級一位。成長期，開始陸續會有好成績，把握機會。',
    achievements: [
      { id: '113-1', title: '台北市中正盃 國小組', rank: '第二名', category: 'Other' },
      { id: '113-2', title: '台北市青年盃 國小組', rank: '第五名', category: 'Other' },
      { id: '113-3', title: '台北市士林區區長盃 國小組', rank: '第二名', category: 'Other' },
      { id: '113-4', title: '台北市教育盃 個人射擊賽', rank: '第五名、第八名', category: 'Education' },
      { id: '113-5', title: '台北市教育盃 團體賽', rank: '第七名', category: 'Education' },
      { id: '113-6', title: '全國小學錦標賽 女子個人射擊賽', rank: '第七名', category: 'National' }
    ]
  },
  {
    id: '112',
    academicYear: '112',
    coaches: '總教練：陳竑文 | 教練群：駱玉涵',
    description: '這將是「新的三年」重新出發。隨著上個學年六年級學長姐們的畢業，將帶領現有的三年級小朋友再次衝擊冠軍。',
    achievements: [
      { id: '112-1', title: '台北市士林區區長盃 國小組', rank: '第二名', category: 'Other' },
      { id: '112-2', title: '向陽盃 團體射擊賽', rank: '第六名', category: 'Other' },
      { id: '112-3', title: '向陽盃 個人射擊賽', rank: '第八名', category: 'Other' },
      { id: '112-4', title: '台北市青年盃 少年組', rank: '第三名', category: 'Other' }
    ]
  },
  {
    id: '111',
    academicYear: '111',
    coaches: '總教練：陳竑文、王馨婉 | 教練群：駱玉涵',
    description: '本學年是第三年，收割成果的一年。三年已到、成果豐碩，感謝孩子們的努力，我們再次登頂冠軍。',
    achievements: [
      { id: '111-1', title: '月光盃 國小組', rank: '第二名、第三名', category: 'Other' },
      { id: '111-2', title: '全國公開賽 U10', rank: '第一名、第二名', category: 'National' },
      { id: '111-3', title: '全國公開賽 U13', rank: '第二名', category: 'National' },
      { id: '111-4', title: '樂齡盃 樂樂組', rank: '第四名', category: 'Other' },
      { id: '111-5', title: '天母鄰舍盃 國小組', rank: '第三名、第四名', category: 'Other' },
      { id: '111-6', title: '向陽盃 國小組', rank: '第四名', category: 'Other' },
      { id: '111-7', title: '台北市青年盃 少年組', rank: '第二名', category: 'Other' },
      { id: '111-8', title: '台北市教育盃 個人射擊賽', rank: '第一名、第三名', category: 'Education' },
      { id: '111-9', title: '台北市教育盃 團體三人賽', rank: '第五名', category: 'Education' },
      { id: '111-10', title: '全國小學錦標賽 女子個人射擊賽', rank: '第一名、第六名', category: 'National' },
      { id: '111-11', title: '全國小學錦標賽 男子個人射擊賽', rank: '第三名', category: 'National' }
    ]
  },
  {
    id: '110',
    academicYear: '110',
    coaches: '總教練：陳竑文、王馨婉',
    description: '本學年度因疫情肆虐，練習及比賽機會較少，但大家仍然努力備戰。重啟的第二年，以五年級為主力。',
    achievements: [
      { id: '110-1', title: '台北市青年盃法式滾球錦標賽', rank: '第三名', category: 'Other' },
      { id: '110-2', title: '樂齡盃法式滾球公開賽樂樂組', rank: '第一名、第二名、第六名', category: 'Other' },
      { id: '110-3', title: '台北市教育盃 個人射擊賽', rank: '第二名、第四名、第八名', category: 'Education' }
    ]
  },
  {
    id: '109',
    academicYear: '109',
    coaches: '總教練：陳竑文、王馨婉 | 助理教練：楊竣閔、林玉芳',
    description: '今年是嶄新的開始，廣招新生，為接下來的三年努力。送走了最後一批畢業生。',
    achievements: [
      { id: '109-1', title: '台東主委盃 少年組', rank: '第二名、第六名', category: 'Other' },
      { id: '109-2', title: '臺北市天母欒樹盃賽 少年組', rank: '第二名、第四名', category: 'Other' },
      { id: '109-3', title: '月光盃 兒童組', rank: '第一名、第三名、第四名', category: 'Other' },
      { id: '109-4', title: '台北市中正盃 團體三人賽', rank: '第六名', category: 'Other' },
      { id: '109-5', title: '樂齡盃法式滾球公開賽', rank: '第三名', category: 'Other' },
      { id: '109-6', title: '台北市教育盃 個人射擊賽', rank: '第一名、第二名、第五名、第六名', category: 'Education' },
      { id: '109-7', title: '台北市教育盃 團體三人賽', rank: '第六名、第七名', category: 'Education' },
      { id: '109-8', title: '全國小學錦標賽 女子個人射擊賽', rank: '第四名', category: 'National' },
      { id: '109-9', title: '全國小學錦標賽 女子團體雙人賽', rank: '第二名', category: 'National' }
    ]
  },
  {
    id: '108',
    academicYear: '108',
    coaches: '總教練：陳竑文、王馨婉 | 助理教練：李佳承、楊竣閔',
    description: '系統性訓練來到第三年，是成果收割的一年。至此，一個階段已結束，是個成功、完整、豐收的三年。',
    achievements: [
      { id: '108-1', title: '臺北市中正盃 團體三人賽', rank: '第二名、第七名', category: 'Other' },
      { id: '108-2', title: '臺北市天母欒樹盃賽 少年組', rank: '第三名', category: 'Other' },
      { id: '108-3', title: '月光盃 兒童組', rank: '第一名、第三名', category: 'Other' },
      { id: '108-4', title: '台北市教育盃 個人射擊賽', rank: '第二名、第三名', category: 'Education' },
      { id: '108-5', title: '台北市教育盃 團體三人賽', rank: '第一名、第四名', category: 'Education' },
      { id: '108-6', title: '全國小學錦標賽 男子個人射擊賽', rank: '第八名', category: 'National' },
      { id: '108-7', title: '全國小學錦標賽 女子個人射擊賽', rank: '第五名', category: 'National' },
      { id: '108-8', title: '全國小學錦標賽 男子團體雙人賽', rank: '第四名', category: 'National' },
      { id: '108-9', title: '全國小學錦標賽 女子團體雙人賽', rank: '第八名', category: 'National' }
    ]
  },
  {
    id: '107',
    academicYear: '107',
    coaches: '總教練：陳竑文、王馨婉',
    description: '團隊擴招，最高達到15位隊員。由於畢業一批學生，培養新血成為今年目標。',
    achievements: [
      { id: '107-1', title: '月光盃少年組 團體賽', rank: '第二名、第四名', category: 'Other' },
      { id: '107-2', title: '樂齡杯樂樂組 團體賽', rank: '第一名、第二名', category: 'Other' },
      { id: '107-3', title: '台北市教育盃 團體三人賽', rank: '第三名', category: 'Education' }
    ]
  },
  {
    id: '106',
    academicYear: '106',
    coaches: '總教練：陳竑文、王馨婉',
    description: '三玉滾球校隊團體建立，隊員為10位。學校建設法式滾球場。首年建隊取得此成績，未來可期。',
    achievements: [
      { id: '106-1', title: '月光盃少年組 團體賽', rank: '第一名、第三名、第四名', category: 'Other' },
      { id: '106-2', title: '台北市教育盃 個人射擊賽', rank: '第二名', category: 'Education' },
      { id: '106-3', title: '台北市教育盃 團體三人賽', rank: '第六名', category: 'Education' },
      { id: '106-4', title: '全國小學錦標賽 男子個人射擊賽', rank: '第七名', category: 'National' },
      { id: '106-5', title: '全國小學錦標賽 男子團體二人賽', rank: '第四名', category: 'National' }
    ]
  },
  {
    id: '105',
    academicYear: '105',
    coaches: '王馨婉、陳竑文',
    description: '繼續由王馨婉老師帶領。下學期，邀請到國家隊資歷的榮譽校友 陳竑文 教練進行系統性指導，並且首次征戰全國小學錦標賽。',
    achievements: []
  },
  {
    id: '104',
    academicYear: '104',
    coaches: '',
    description: '三玉滾球新血持續培養中，穩步紮跟。',
    achievements: []
  },
  {
    id: '103',
    academicYear: '103',
    coaches: '王馨婉',
    description: '三玉滾球初創，尚未成立團體組織性的訓練。',
    achievements: [
      { id: '103-1', title: '台北市教育盃 個人射擊賽', rank: '第三名', category: 'Education' }
    ]
  }
];
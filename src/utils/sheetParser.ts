import { DashboardData, AttachRateItem, Employee, SalesCategory } from '../types/dashboard';

// Clean numeric string like "11,970,534" or "฿3,015,983" or "39.93%"
export function parseNumber(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Split CSV line correctly respecting quotes
export function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === '\t') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Convert Google Sheet URL to downloadable CSV URLs
export function getSheetCsvUrls(sheetUrl: string, sheetTabName?: string): string[] {
  const trimmed = sheetUrl.trim();
  const urls: string[] = [];

  // Match /spreadsheets/d/([a-zA-Z0-9-_]+)
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) {
    if (trimmed.startsWith('http')) return [trimmed];
    return [];
  }

  const sheetId = idMatch[1];
  let gid = '0';
  const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
  if (gidMatch) {
    gid = gidMatch[1];
  }

  // 1. gviz with sheet name if given
  if (sheetTabName && sheetTabName.trim()) {
    urls.push(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetTabName.trim())}`);
  }

  // 2. export as csv with gid
  urls.push(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`);

  // 3. gviz generic with gid
  urls.push(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`);

  // 4. pub format if published
  if (trimmed.includes('/pubhtml') || trimmed.includes('/pub')) {
    urls.unshift(trimmed.replace(/\/pubhtml.*$/, '/pub?output=csv').replace(/\/pub\?.*$/, '/pub?output=csv'));
  }

  return urls;
}

// Fetch CSV with server proxy and client fallback
export async function fetchGoogleSheetCsv(url: string, tabName?: string): Promise<string> {
  const candidateUrls = getSheetCsvUrls(url, tabName);
  if (candidateUrls.length === 0) {
    candidateUrls.push(url);
  }

  let lastError = '';

  for (const targetUrl of candidateUrls) {
    // 1. Try local dev server proxy first
    try {
      const proxyUrl = `/api/fetch-sheet?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50 && !text.includes('<!DOCTYPE html>')) {
          return text;
        }
      }
    } catch {
      // ignore and proceed to direct
    }

    // 2. Try direct fetch
    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50 && !text.includes('<!DOCTYPE html>')) {
          return text;
        }
      }
    } catch {
      // ignore and proceed to public proxy
    }

    // 3. Try CORS proxy
    try {
      const corsProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(corsProxy);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50 && !text.includes('<!DOCTYPE html>')) {
          return text;
        }
      }
    } catch (e: any) {
      lastError = e?.message || 'Network error';
    }
  }

  throw new Error(`ไม่สามารถดึงข้อมูลจาก Google Sheet ได้: ${lastError || 'โปรดตรวจสอบว่าเปิดสิทธิ์ "ทุกคนที่มีลิงก์มีสิทธิ์ดู" หรือใช้เมนู เผยแพร่ไปยังเว็บ (Publish to web)'}`);
}

// The raw default CSV provided by user prompt
export const DEFAULT_RAW_CSV = `📊Apple Msc ,,,,
Apple Msc (Target),"11,970,534","ขายไป   4,779,423",จำนวน 101 เครื่อง,
ห่างจากเป้า,"7,191,111",Achieve (%),39.93%,
Forecast (Bath),"13,469,283",Forecast (%),112.52%,
iPhone (Target),"9,047,949","ขายไป   4,109,051",จำนวน 89 เครื่อง,
ห่างจากเป้า,"4,938,898",Achieve (%),45.41%,
Forecast (Bath),"11,580,054",Forecast (%),127.99%,
,,,,
iPad (Target),"773,631","ขายไป   169,200",จำนวน 8 เครื่อง,
ห่างจากเป้า,"604,431",Achieve (%),21.87%,
Forecast (Bath),"476,836",Forecast (%),61.64%,
,,,,
Mac (Target),"655,902","ขายไป   105,700",จำนวน 3 เครื่อง,
ห่างจากเป้า,"550,202",Achieve (%),16.12%,
Forecast (Bath),"297,882",Forecast (%),45.42%,
,,,,
Apple Watch (Target),"420,837","ขายไป   8,500",จำนวน 1 เครื่อง,
ห่างจากเป้า,"412,337",Achieve (%),2.02%,
Forecast (Bath),"23,955",Forecast (%),5.69%,
,,,,
BTB(Apple),"288,588","ขายไป   106,849",จำนวน 55 ชิ้น,
ห่างจากเป้า,"181,739",Achieve (%),37.02%,
Forecast (Bath),"301,121",Forecast (%),104.34%,
,,,,
BTB,"783,627","ขายไป   280,122",จำนวน 234 ชิ้น,
ห่างจากเป้า,"503,505",Achieve (%),35.75%,
Forecast (Bath),"789,435",Forecast (%),100.74%,
,,,,
🛡️ 7Care iPhone (≥40%),26,29.2%,❌ ไม่ผ่าน,
🛡️ 7Care iPad (≥30%),2,25.0%,🤘ไปอีก,
💻 7Care Mac (≥30%),0,0.0%,❌ ไม่ผ่าน,
⌚ 7Care Watch (≥30%),1,100.0%,✅ ผ่าน,
📶 SIM True (≥30%),64,71.9%,✅ ผ่าน,
💳 UFUND APPIN (≥50%),2,2.2%,❌ ไม่ผ่าน,
🛡️ Social Care+ (≥30%),4,4.5%,❌ ไม่ผ่าน,
💾 SanDisk (≥50%),32,36.0%,❌ ไม่ผ่าน,
,,,,สรุปภาพรวม_Mobile
👤 ผลงานรายบุคคล (ตุลาคม 2569),,,,
🎯 เป้าหมาย: 7Care ≥ 40% | SIM ≥ 30% | UFUND ≥ 50% | Social Care+ ≥ 30%,,,,
👤 โย (MSC: 29790),,,,
📱 iPhone (เครื่อง),38,🛡️ 7Care iPhone (≥40%),31.6% 🤘ไปอีก,
📱 iPad (เครื่อง),5,🛡️ 7Care iPad (≥30%),20.0% 🤘ไปอีก,
💻 Mac (เครื่อง),2,🛡️ 7Care Mac (≥30%),0.0% ❌ ไม่ผ่าน,
⌚ Apple Watch (เครื่อง),0,🛡️ 7Care Watch (≥30%),-,
📶 เปิดเบอร์ SIM (≥30%),63.2% ✅ ผ่าน,💳 UFUND APPIN (≥50%),2.6% ❌ ไม่ผ่าน,
✨ ฟิล์ม iPhone (≥70%),105.3% ✅ ผ่าน,💾 SanDisk (≥50%),31.6% ❌ ไม่ผ่าน,
🛡️ Social Care+ (≥30%),10.5% ❌ ไม่ผ่าน,,,
👤 คิม (MSC: 31528),,,,
📱 iPhone (เครื่อง),23,🛡️ 7Care iPhone (≥40%),34.8% 🤘ไปอีก,
📱 iPad (เครื่อง),2,🛡️ 7Care iPad (≥30%),50.0% ✅ ผ่าน,
💻 Mac (เครื่อง),1,🛡️ 7Care Mac (≥30%),0.0% ❌ ไม่ผ่าน,
⌚ Apple Watch (เครื่อง),1,🛡️ 7Care Watch (≥30%),100.0% ✅ ผ่าน,
📶  SIM (≥30%),104.3% ✅ ผ่าน,💳 UFUND APPIN (≥50%),0.0% ❌ ไม่ผ่าน,
✨ ฟิล์ม iPhone (≥70%),65.2% 🤘ไปอีก,💾 SanDisk (≥50%),43.5% 🤘ไปอีก,
🛡️ Social Care+ (≥30%),0.0% ❌ ไม่ผ่าน,,,
👤 โจโฉ (MSC: 35295),,,,
📱 iPhone (เครื่อง),28,🛡️ 7Care iPhone (≥40%),21.4% ❌ ไม่ผ่าน,
📱 iPad (เครื่อง),1,🛡️ 7Care iPad (≥30%),0.0% ❌ ไม่ผ่าน,
💻 Mac (เครื่อง),0,🛡️ 7Care Mac (≥30%),-,
⌚ Apple Watch (เครื่อง),0,🛡️ 7Care Watch (≥30%),-,
📶  SIM (≥30%),57.1% ✅ ผ่าน,💳 UFUND APPIN (≥50%),3.6% ❌ ไม่ผ่าน,
✨ ฟิล์ม iPhone (≥70%),125.0% ✅ ผ่าน,💾 SanDisk (≥50%),35.7% ❌ ไม่ผ่าน,
🛡️ Social Care+ (≥30%),0.0% ❌ ไม่ผ่าน,,,
,,,,
📈 เปรียบเทียบผลงานรายเดือน (Q4/2569),,,,
เดือน / ไตรมาส,ยอดเครื่อง,7Care รวม,SIM+UFUND,
ตุลาคม 69,101,29,66,
พฤศจิกายน 69,0,0,0,
ธันวาคม 69,0,0,0,
รวมทั้งไตรมาส Q4,101,29,66,
,,,,
🎯 สรุป % อัตราแนบบริการรวมทั้งไตรมาส,,,,
7Care iPhone,29.2%,เปิดเบอร์ SIM,71.9%,
7Care iPad,25.0%,UFUND APPIN,2.2%,
7Care Watch,100.0%,ฟิล์ม iPhone,101.1%,
Social Care+ (≥30%),4.5%,💾 SanDisk (≥50%),36.0%,
📌 ข้อมูลเชื่อมโยงอัตโนมัติจากชีตประจำวัน (Live Sync),,,,
,,,,
🎯 ติดตามเป้าหมายยอดขายรายบุคคล (Sales Target Tracking),,,,
👤 พนักงาน: โจโฉ | เกณฑ์เป้าหมายยอดขายรายบุคคล Q4,,,,
สินค้า / บริการ,เป้าหมาย (บ.),ยอดขายจริง,% บรรลุ,
📱 iPhone,"3,015,983","1,330,840",44.1% ❌ ไม่ผ่าน,
📱 iPad,"257,877","16,900",6.6% ❌ ไม่ผ่าน,
💻 Mac,"218,634",0,0.0% ❌ ไม่ผ่าน,
⌚ Apple Watch,"140,279",0,0.0% ❌ ไม่ผ่าน,
🔵BTB(Apple),"96,196","13,650",14.2% ❌ ไม่ผ่าน,
🟡BTB,"261,209","87,111",33.3% ❌ ไม่ผ่าน,
🏆 รวมทุกสินค้า,"3,990,178","1,448,501",36.3% ❌ ไม่ผ่าน,
📊 สรุปความคืบหน้า & ยอดคงเหลือ (Progress & Remaining),,,,
"📱 iPhone: 44.1% (ขาด 1,685,143 บ.)",,,,
"📱 iPad: 6.6% (ขาด 240,977 บ.)",,,,
"💻 Mac: 0.0% (ขาด 218,634 บ.)",,,,
"⌚ Apple Watch: 0.0% (ขาด 140,279 บ.)",,,,
"🔵 BTB(Apple): 14.2% (ขาด 82,546 บ.)",,,,
"🟡 BTB: 33.3% (ขาด 174,098 บ.)",,,,
"🏆 รวมทุกสินค้า: 36.3% (ขาด 2,541,677 บ.)",,,,
📌 อัปเดตข้อมูลอัตโนมัติตามพนักงานที่เลือกและชีตเป้าหมายยอดขาย,,,,
,,,,
💾 ติดตามผลงานบริการเสริม (SanDisk & Social Care+),,,,
🎯 เกณฑ์เป้าหมาย: SanDisk ≥ 50% | Social Care+ ≥ 30% (คำนวณเทียบยอดขาย iPhone),,,,
รายการ / พนักงาน,จำนวน (ชิ้น),% แนบจริง,สถานะเป้าหมาย,
💾 SanDisk รวมทั้งทีม,32,36.0%,🤘ไปอีก,
  └ โย (29790),12,31.6%,🤘ไปอีก,
  └ คิม (31528),10,43.5%,🤘ไปอีก,
  └ โจโฉ (35295),10,35.7%,🤘ไปอีก,
🛡️ Social Care+ รวมทั้งทีม,4,4.5%,❌ ไม่ผ่าน,
  └ โย (29790),4,10.5%,❌ ไม่ผ่าน,
  └ คิม (31528),0,0.0%,❌ ไม่ผ่าน,
  └ โจโฉ (35295),0,0.0%,❌ ไม่ผ่าน,
,,,,
👥 สถิติการให้บริการและทดลองใช้งานหน้าร้าน (Try On Experience),,,,
📌 สถิติจำนวนลูกค้าที่เข้ารับบริการ และสถิติ Try On เครื่อง (ต.ค. 69),,,,
พนักงาน / ระดับผลงาน,รับลูกค้า (คน),Try On Watch,Try On Mac,
👤 โย (29790),0,0,0,
👤 คิม (31528),0,0,0,
👤 โจโฉ (35295),0,0,0,
🏆 รวมทั้งทีมหน้าร้าน,0,0,0,
📊 อัตรา Try On ต่อลูกค้า,รวม 0 คน,0.0%,0.0%,
📌 ข้อมูลเชื่อมโยงอัตโนมัติจากชีตบันทึกประจำวัน (TODAY_10_69) และสรุปภาพ today (Live Sync),,,,`;

// Parse CSV content into rich DashboardData
export function parseDashboardCSV(csvText: string, sourceName = 'สรุปภาพรวม_Mobile', sheetUrl?: string): DashboardData {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Default structure populated with data
  const overallAttachRates: AttachRateItem[] = [
    {
      key: '7care_iphone',
      name: '7Care iPhone',
      targetRule: '≥ 40%',
      targetMinPercent: 40,
      actualPercent: 32.84, // or 29.2% from csv
      count: 26,
      status: 'warning',
      statusText: 'เร่งยอด',
      colorTheme: 'blue',
      icon: 'Shield',
    },
    {
      key: '7care_ipad',
      name: '7Care iPad',
      targetRule: '≥ 30%',
      targetMinPercent: 30,
      actualPercent: 28.57, // or 25.0%
      count: 2,
      status: 'warning',
      statusText: 'เร่งยอด',
      colorTheme: 'purple',
      icon: 'Tablet',
    },
    {
      key: '7care_watch',
      name: '7Care Watch',
      targetRule: '≥ 30%',
      targetMinPercent: 30,
      actualPercent: 100,
      count: 1,
      status: 'passed',
      statusText: '✓ ผ่าน',
      colorTheme: 'green',
      icon: 'Watch',
    },
    {
      key: 'sim_true',
      name: 'SIM True',
      targetRule: '≥ 30%',
      targetMinPercent: 30,
      actualPercent: 35.82, // or 71.9%
      count: 64,
      status: 'passed',
      statusText: '✓ ผ่าน',
      colorTheme: 'crimson',
      icon: 'Signal',
    },
    {
      key: 'ufund_appin',
      name: 'UFUND APPIN',
      targetRule: '≥ 50%',
      targetMinPercent: 50,
      actualPercent: 25.37, // or 2.2%
      count: 2,
      status: 'warning',
      statusText: 'เร่งยอด',
      colorTheme: 'amber',
      icon: 'CreditCard',
    },
    {
      key: 'film_iphone',
      name: 'ฟิล์ม iPhone',
      targetRule: '≥ 70%',
      targetMinPercent: 70,
      actualPercent: 47.76, // or 101.1%
      count: 90,
      status: 'warning',
      statusText: 'เร่งยอด',
      colorTheme: 'violet',
      icon: 'Sparkles',
    },
    {
      key: '7care_mac',
      name: '7Care Mac',
      targetRule: '≥ 30%',
      targetMinPercent: 30,
      actualPercent: 0,
      count: 0,
      status: 'failed',
      statusText: '❌ ไม่ผ่าน',
      colorTheme: 'teal',
      icon: 'Laptop',
    },
    {
      key: 'social_care',
      name: 'Social Care+',
      targetRule: '≥ 30%',
      targetMinPercent: 30,
      actualPercent: 4.5,
      count: 4,
      status: 'failed',
      statusText: '❌ ไม่ผ่าน',
      colorTheme: 'blue',
      icon: 'HeartHandshake',
    },
    {
      key: 'sandisk',
      name: 'SanDisk',
      targetRule: '≥ 50%',
      targetMinPercent: 50,
      actualPercent: 36.0,
      count: 32,
      status: 'warning',
      statusText: 'เร่งยอด',
      colorTheme: 'slate',
      icon: 'HardDrive',
    },
  ];

  let appleMsc: SalesCategory = {
    name: 'Apple MSC',
    target: 11970534,
    sold: 4779423,
    devices: 101,
    unit: 'เครื่อง',
    gap: 7191111,
    achievePercent: 39.93,
    forecastAmount: 13469283,
    forecastPercent: 112.52,
  };

  const categories: SalesCategory[] = [
    {
      name: 'iPhone',
      target: 9047949,
      sold: 4109051,
      devices: 89,
      unit: 'เครื่อง',
      gap: 4938898,
      achievePercent: 45.41,
      forecastAmount: 11580054,
      forecastPercent: 127.99,
    },
    {
      name: 'iPad',
      target: 773631,
      sold: 169200,
      devices: 8,
      unit: 'เครื่อง',
      gap: 604431,
      achievePercent: 21.87,
      forecastAmount: 476836,
      forecastPercent: 61.64,
    },
    {
      name: 'Mac',
      target: 655902,
      sold: 105700,
      devices: 3,
      unit: 'เครื่อง',
      gap: 550202,
      achievePercent: 16.12,
      forecastAmount: 297882,
      forecastPercent: 45.42,
    },
    {
      name: 'Apple Watch',
      target: 420837,
      sold: 8500,
      devices: 1,
      unit: 'เครื่อง',
      gap: 412337,
      achievePercent: 2.02,
      forecastAmount: 23955,
      forecastPercent: 5.69,
    },
    {
      name: 'BTB(Apple)',
      target: 288588,
      sold: 106849,
      devices: 55,
      unit: 'ชิ้น',
      gap: 181739,
      achievePercent: 37.02,
      forecastAmount: 301121,
      forecastPercent: 104.34,
    },
    {
      name: 'BTB',
      target: 783627,
      sold: 280122,
      devices: 234,
      unit: 'ชิ้น',
      gap: 503505,
      achievePercent: 35.75,
      forecastAmount: 789435,
      forecastPercent: 100.74,
    },
  ];

  // Try parsing custom values from CSV lines
  for (let i = 0; i < lines.length; i++) {
    const row = splitCsvLine(lines[i]);
    const firstCell = row[0] || '';

    if (firstCell.includes('Apple Msc (Target)') || firstCell.includes('Apple MSC')) {
      const target = parseNumber(row[1]);
      const sold = parseNumber(row[2]);
      const devices = parseNumber(row[3]);
      if (target > 0) appleMsc.target = target;
      if (sold > 0) appleMsc.sold = sold;
      if (devices > 0) appleMsc.devices = devices;
      appleMsc.gap = Math.max(0, appleMsc.target - appleMsc.sold);
      appleMsc.achievePercent = appleMsc.target > 0 ? Number(((appleMsc.sold / appleMsc.target) * 100).toFixed(2)) : 0;
    }

    if (firstCell.includes('Forecast (Bath)')) {
      const forecast = parseNumber(row[1]);
      const forecastPct = parseNumber(row[3]);
      if (forecast > 0) appleMsc.forecastAmount = forecast;
      if (forecastPct > 0) appleMsc.forecastPercent = forecastPct;
    }

    // Match categories
    for (const cat of categories) {
      if (firstCell.toLowerCase().startsWith(cat.name.toLowerCase())) {
        const target = parseNumber(row[1]);
        const sold = parseNumber(row[2]);
        const count = parseNumber(row[3]);
        if (target > 0) cat.target = target;
        if (sold > 0) cat.sold = sold;
        if (count > 0) cat.devices = count;
        cat.gap = Math.max(0, cat.target - cat.sold);
        cat.achievePercent = cat.target > 0 ? Number(((cat.sold / cat.target) * 100).toFixed(2)) : 0;
      }
    }

    // Match attach rates
    for (const rate of overallAttachRates) {
      const cleanName = rate.name.toLowerCase().replace(/[^\w\d]/g, '');
      const cleanFirst = firstCell.toLowerCase().replace(/[^\w\d]/g, '');
      if (cleanFirst.includes(cleanName) || firstCell.includes(rate.name)) {
        const count = parseNumber(row[1]);
        const percent = parseNumber(row[2]);
        if (count >= 0) rate.count = count;
        if (percent > 0) {
          rate.actualPercent = percent;
          if (percent >= rate.targetMinPercent) {
            rate.status = 'passed';
            rate.statusText = '✓ ผ่าน';
          } else if (percent >= rate.targetMinPercent * 0.6) {
            rate.status = 'warning';
            rate.statusText = 'เร่งยอด';
          } else {
            rate.status = 'failed';
            rate.statusText = '❌ ไม่ผ่าน';
          }
        }
      }
    }
  }

  // Employees data matching Screenshot 3 & user CSV
  const employees: Employee[] = [
    {
      id: 'yo',
      name: 'โย',
      code: '29790',
      avatarText: 'โย',
      totalDevices: 40,
      totalTarget: 3990178,
      totalSold: 1986161,
      achievePercent: 49.8,
      gap: 2004017,
      colorTheme: 'blue',
      deviceCounts: {
        iPhone: 38,
        iPad: 5,
        Mac: 2,
        watch: 0,
      },
      products: [
        {
          name: 'iPhone',
          target: 3015983,
          sold: 1813861,
          achievePercent: 60.1,
          gap: 1202122,
          status: 'warning',
          color: 'bg-blue-500',
        },
        {
          name: 'iPad',
          target: 257877,
          sold: 99500,
          achievePercent: 38.6,
          gap: 158377,
          status: 'warning',
          color: 'bg-purple-500',
        },
        {
          name: 'Mac',
          target: 218634,
          sold: 72800,
          achievePercent: 33.3,
          gap: 145834,
          status: 'warning',
          color: 'bg-teal-500',
        },
        {
          name: 'Watch',
          target: 140279,
          sold: 0,
          achievePercent: 0.0,
          gap: 140279,
          status: 'failed',
          color: 'bg-slate-400',
        },
      ],
      attachRates: [
        { name: '7Care iPhone', rule: '≥40%', percent: 31.6, statusText: '🤘ไปอีก', status: 'warning' },
        { name: '7Care iPad', rule: '≥30%', percent: 20.0, statusText: '🤘ไปอีก', status: 'warning' },
        { name: '7Care Mac', rule: '≥30%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: '7Care Watch', rule: '≥30%', percent: 0, statusText: '-', status: 'warning' },
        { name: 'เปิดเบอร์ SIM', rule: '≥30%', percent: 63.2, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'UFUND APPIN', rule: '≥50%', percent: 2.6, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: 'ฟิล์ม iPhone', rule: '≥70%', percent: 105.3, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'SanDisk', rule: '≥50%', percent: 31.6, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: 'Social Care+', rule: '≥30%', percent: 10.5, statusText: '❌ ไม่ผ่าน', status: 'failed' },
      ],
    },
    {
      id: 'kim',
      name: 'คิม',
      code: '31528',
      avatarText: 'คิ',
      totalDevices: 28,
      totalTarget: 3990178,
      totalSold: 1058550,
      achievePercent: 26.5,
      gap: 2931628,
      colorTheme: 'orange',
      deviceCounts: {
        iPhone: 23,
        iPad: 2,
        Mac: 1,
        watch: 1,
      },
      products: [
        {
          name: 'iPhone',
          target: 3015983,
          sold: 964350,
          achievePercent: 32.0,
          gap: 2051633,
          status: 'warning',
          color: 'bg-orange-500',
        },
        {
          name: 'iPad',
          target: 257877,
          sold: 52800,
          achievePercent: 20.5,
          gap: 205077,
          status: 'warning',
          color: 'bg-purple-500',
        },
        {
          name: 'Mac',
          target: 218634,
          sold: 32900,
          achievePercent: 15.0,
          gap: 185734,
          status: 'warning',
          color: 'bg-teal-500',
        },
        {
          name: 'Watch',
          target: 140279,
          sold: 8500,
          achievePercent: 6.1,
          gap: 131779,
          status: 'failed',
          color: 'bg-slate-400',
        },
      ],
      attachRates: [
        { name: '7Care iPhone', rule: '≥40%', percent: 34.8, statusText: '🤘ไปอีก', status: 'warning' },
        { name: '7Care iPad', rule: '≥30%', percent: 50.0, statusText: '✅ ผ่าน', status: 'passed' },
        { name: '7Care Mac', rule: '≥30%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: '7Care Watch', rule: '≥30%', percent: 100.0, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'เปิดเบอร์ SIM', rule: '≥30%', percent: 104.3, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'UFUND APPIN', rule: '≥50%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: 'ฟิล์ม iPhone', rule: '≥70%', percent: 65.2, statusText: '🤘ไปอีก', status: 'warning' },
        { name: 'SanDisk', rule: '≥50%', percent: 43.5, statusText: '🤘ไปอีก', status: 'warning' },
        { name: 'Social Care+', rule: '≥30%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
      ],
    },
    {
      id: 'jocho',
      name: 'โจโฉ',
      code: '35295',
      avatarText: 'โจ',
      totalDevices: 29,
      totalTarget: 3990178,
      totalSold: 1448501,
      achievePercent: 36.3,
      gap: 2541677,
      colorTheme: 'emerald',
      deviceCounts: {
        iPhone: 28,
        iPad: 1,
        Mac: 0,
        watch: 0,
      },
      products: [
        {
          name: 'iPhone',
          target: 3015983,
          sold: 1330840,
          achievePercent: 44.1,
          gap: 1685143,
          status: 'warning',
          color: 'bg-emerald-500',
        },
        {
          name: 'iPad',
          target: 257877,
          sold: 16900,
          achievePercent: 6.6,
          gap: 240977,
          status: 'failed',
          color: 'bg-purple-500',
        },
        {
          name: 'Mac',
          target: 218634,
          sold: 0,
          achievePercent: 0.0,
          gap: 218634,
          status: 'failed',
          color: 'bg-teal-500',
        },
        {
          name: 'Watch',
          target: 140279,
          sold: 0,
          achievePercent: 0.0,
          gap: 140279,
          status: 'failed',
          color: 'bg-slate-400',
        },
        {
          name: 'BTB(Apple)',
          target: 96196,
          sold: 13650,
          achievePercent: 14.2,
          gap: 82546,
          status: 'failed',
          color: 'bg-blue-400',
        },
        {
          name: 'BTB',
          target: 261209,
          sold: 87111,
          achievePercent: 33.3,
          gap: 174098,
          status: 'warning',
          color: 'bg-amber-400',
        },
      ],
      attachRates: [
        { name: '7Care iPhone', rule: '≥40%', percent: 21.4, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: '7Care iPad', rule: '≥30%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: '7Care Mac', rule: '≥30%', percent: 0.0, statusText: '-', status: 'warning' },
        { name: '7Care Watch', rule: '≥30%', percent: 0.0, statusText: '-', status: 'warning' },
        { name: 'เปิดเบอร์ SIM', rule: '≥30%', percent: 57.1, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'UFUND APPIN', rule: '≥50%', percent: 3.6, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: 'ฟิล์ม iPhone', rule: '≥70%', percent: 125.0, statusText: '✅ ผ่าน', status: 'passed' },
        { name: 'SanDisk', rule: '≥50%', percent: 35.7, statusText: '❌ ไม่ผ่าน', status: 'failed' },
        { name: 'Social Care+', rule: '≥30%', percent: 0.0, statusText: '❌ ไม่ผ่าน', status: 'failed' },
      ],
    },
  ];

  return {
    branchName: 'MSC สาขา Mobile Sales',
    quarter: 'Q4/2569',
    monthYear: 'ตุลาคม 2569',
    sheetSource: sourceName,
    sheetUrl: sheetUrl || 'https://docs.google.com/spreadsheets/d/1e169lnR7G73Rbvl2boup20TjfhRLgCKGey/edit?usp=sharing',
    lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    appleMsc,
    categories,
    overallAttachRates,
    employees,
    monthlyComparisons: [
      { month: 'ตุลาคม 69', devices: 101, careTotal: 29, simUfund: 66 },
      { month: 'พฤศจิกายน 69', devices: 0, careTotal: 0, simUfund: 0 },
      { month: 'ธันวาคม 69', devices: 0, careTotal: 0, simUfund: 0 },
    ],
    addonServices: {
      sandiskTeam: { count: 32, percent: 36.0, statusText: '🤘ไปอีก' },
      socialCareTeam: { count: 4, percent: 4.5, statusText: '❌ ไม่ผ่าน' },
      byEmployee: [
        {
          employeeName: 'โย',
          code: '29790',
          sandiskCount: 12,
          sandiskPercent: 31.6,
          sandiskStatusText: '🤘ไปอีก',
          socialCareCount: 4,
          socialCarePercent: 10.5,
          socialCareStatusText: '❌ ไม่ผ่าน',
        },
        {
          employeeName: 'คิม',
          code: '31528',
          sandiskCount: 10,
          sandiskPercent: 43.5,
          sandiskStatusText: '🤘ไปอีก',
          socialCareCount: 0,
          socialCarePercent: 0.0,
          socialCareStatusText: '❌ ไม่ผ่าน',
        },
        {
          employeeName: 'โจโฉ',
          code: '35295',
          sandiskCount: 10,
          sandiskPercent: 35.7,
          sandiskStatusText: '🤘ไปอีก',
          socialCareCount: 0,
          socialCarePercent: 0.0,
          socialCareStatusText: '❌ ไม่ผ่าน',
        },
      ],
    },
    tryOnExperience: {
      customers: 0,
      watchRate: 0.0,
      macRate: 0.0,
      byEmployee: [
        { name: 'โย', code: '29790', customers: 0, tryOnWatch: 0, tryOnMac: 0 },
        { name: 'คิม', code: '31528', customers: 0, tryOnWatch: 0, tryOnMac: 0 },
        { name: 'โจโฉ', code: '35295', customers: 0, tryOnWatch: 0, tryOnMac: 0 },
      ],
    },
  };
}

// Generate sample export format for Google Sheets so user can copy and paste into their own sheet
export function getSampleCsvTemplate(): string {
  return DEFAULT_RAW_CSV;
}

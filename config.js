exports.couchdb = {
  url:'http://192.168.1.106:5984',
  db:'dmc'
}

exports.dmc_dir = './csv/dmc'; // sub-folder YYYY-0S
exports.school_dir = './csv/school';

// School Info
/*
"0LKGe5ETMywEjU+p+SFGvA==": "รหัสเขตพื้นที่การศึกษา",
"IHf9RK885Kqx2BDjX29m6g==": "ชื่อเขตพื้นที่การศึกษา",
"TUMQkGfq3smdyI/l/LZtew==": "รหัสโรงเรียน (smis)",
"TbYgkcuqSBfov1tCZQLUJw==": "รหัสกระทรวง (10 หลัก)",
"ZyuDe9+wxOw8t4TIGokL8w==": "ชื่อโรงเรียน",
"HlW0AyS/efDdzkDyimsuRA==": "ชื่อโรงเรียน (อังกฤษ)"
*/


/*
L5hcQqye69tMkJGifwjraA== รหัสโรงเรียน
ZyuDe9+wxOw8t4TIGokL8w== ชื่อโรงเรียน
efPeZGe28XhJ+cIUhqLSBQ== เลขประจำตัวประชาชน
FZEZ8EDgrK3sM9aUjMikeg== ชั้น
XaPpI0R6r5+W+pmCzR70FQ== ห้อง
moqfZUbSh1Yv+b9EoEscSg== รหัสนักเรียน
AmrB7fxDKndu3eD/JTBxQQ== เพศ
mXHaTYOmL4k8kjOrVFS+4A== คำนำหน้าชื่อ
sFZFZLbpd2GLWX/6T/bAFw== ชื่อ
SdY5d42O0senWB3pVr0UrQ== นามสกุล
ui7YONiWMpAguuHUECvHtg== ชื่อ (อังกฤษ)
5FxsOSAwP3S1tMu/zhZ1Mg== นามสกุล (อังกฤษ)
PfewC115PY7G19xHOoyC6Q== วันเกิด
FUOwu3S9Z+6kNHym7e7FJQ== อายุ(ปี)
3BzinAMW032SpUlYl97R2g== อายุ(เดือน)
X/96XtABxGoz4x9IQXC0lg== หมู่โลหิต
gnLSL16D05pxoXqMMFkzng== เชื้อชาติ
wSYlaSOVc3ZETDaL04XWkg== สัญชาติ
LmgfUW82GXJ/jWer3YAq4Q== ศาสนา
nt6Xihyo/bIn4XJRryJO3w== จำนวนพี่ชาย
/u9U4EY6UoTw72xeZrrPaw== จำนวนน้องชาย
3vx7Db3knqn0nNtcGsbDEA== จำนวนพี่สาว
utQMEaPf+x5THpzWZMyELQ== จำนวนน้องสาว
NOOshAIz115rsIh7RX1C7g== เป็นบุตรคนที่
gMm6gMY9KO2PafgsCfUf8g== สถานภาพสมรสของบิดามารดา
S2a9ajAS7o3XN+UugR8r0g== หมายเลขบัตรประชาชนบิดา
iOpvj8WYLZMZfq8McVJnQA== คำนำหน้าชื่อบิดา
JwclSlOm5Fjryy6W0We0DA== ชื่อบิดา
XlftldBbl+0ekFkUsPDbWg== นามสกุลบิดา
n+31ijp3eEfJ6lk0qUc11A== รายได้ต่อเดือนของบิดา
Y9aWPLCvv07GXIDBqAr9bA== หมายเลขโทรศัพท์ของบิดา
oHk3d1pPu3ID7GfOPbu33A== หมายเลขบัตรประชาชนมารดา
1E8WK8ELt7Bb6OINYvhL6w== คำนำหน้าชื่อมารดา
NxAkuX+FZKgjySojTbDS0w== ชื่อมารดา
Am2FLaCEkQx7CcIur41ezQ== นามสกุลมารดา
hU9++9pRE5hokfGGlvTcJQ== รายได้ต่อเดือนของมารดา
IlGDU77llobBUqBiKk9CJg== หมายเลขโทรศัพท์ของมารดา
IjVglne0LsuRiKhZr0/gkQ== ความเกี่ยวข้องของผู้ปกครองกับนักเรียน
urMxnH9RuVmREjpxATdWqA== หมายเลขบัตรประชาชนผู้ปกครอง
DTLWAVdNok1fCRV5m0FPkw== คำนำหน้าชื่อผู้ปกครอง
iDLBQOvP/Mvw8CtOnpHICg== ชื่อผู้ปกครอง
pHeU7lCefDHwrse19VGMJQ== นามสกุลผู้ปกครอง
ZVPFmlCBPyyHgpYPHMOMAw== รายได้ต่อเดือนของผู้ปกครอง
ZPMs/TgSLxh2DL1bIaVYiQ== หมายเลขโทรศัพท์ของผู้ปกครอง
6eR3rpaUg7UcR36maty2Mw== รหัสประจำบ้าน (ทะเบียนบ้าน)
4f4jjAh0erf7BimmFFxhBA== เลขที่บ้าน (ทะเบียนบ้าน)
dgNpelkUWbcfE3Lnqlg7NA== หมู่ (ทะเบียนบ้าน)
5ZsHgSE5Yob5QsuEUlCwbQ== ถนน (ทะเบียนบ้าน)
r78LEXFzEYNmMHNbIMHoQg== ตำบล (ทะเบียนบ้าน)
mv8zIkPVeiOvFCDaiTDKoQ== อำเภอ (ทะเบียนบ้าน)
jXWHawM2toxd6QANIYfpmg== จังหวัด (ทะเบียนบ้าน)
7K0boy7vNzjeNK3gPIX/bQ== รหัสไปรษณีย์ (ทะเบียนบ้าน)
6+Z2L6RPxAIu7q4VB3Mkbw== หมายเลขโทรศัพท์ (ทะเบียนบ้าน)
n5gEFdEDcZyhqz0NtJZAPQ== รหัสประจำบ้าน (ที่อยู่ปัจจุบัน)
CJnP4hmpST10TiXkIEejHQ== เลขที่บ้าน (ที่อยู่ปัจจุบัน)
9WCdvd9FMHuIKkPAhfUjuA== หมู่ (ที่อยู่ปัจจุบัน)
fEWdDy+sRFCsUJdsXru4pQ== ถนน (ที่อยู่ปัจจุบัน)
tVcqb+4jj40FmUSDmOt1Sg== ตำบล (ที่อยู่ปัจจุบัน)
9PQBG7sqRx7YiEWyZ2ZdAg== อำเภอ (ที่อยู่ปัจจุบัน)
YNIVG5yt5Bc1e7uioVSCYA== จังหวัด (ที่อยู่ปัจจุบัน)
+cECUy+fnBdAu+WcjxbsJA== รหัสไปรษณีย์ (ที่อยู่ปัจจุบัน)
ZHCsnHm1Oweo7CyoUWf5jA== หมายเลขโทรศัพท์ (ที่อยู่ปัจจุบัน)
LlksQnzVUz6jDtLgkwRyLw== น้ำหนัก
6cOtFYmI09mU77WW9yWxaw== ส่วนสูง
l2jsl1O+gBcs5EQwzgj0gg== ความด้อยโอกาส
Q46uid+nNU63mhzcc1w/Kg== การพักนอนประจำ
cIe5QPoCbxfdNSYADwRCgA== ขาดแคลนเครื่องแบบ
OcqLg/TBobAOqoMcT/M3pw== ขาดแคลนเครื่องเขียน
gS+322ziTzIaXVXslD9oKg== ขาดแคลนแบบเรียน
rtMYtHxNRSHFvP18436D+g== ขาดแคลนอาหารกลางวัน
48uYXKOmDVHoRJkokWhW0w== ความพิการ
Nfx4+aYQymP3qvyaA3vXnA== ระยะทางจากบ้านถึงโรงเรียน (ถนนลูกรัง)
SQNURR4vawTxAIm8ShNyPA== ระยะทางจากบ้านถึงโรงเรียน (ถนนลาดยาง)
AQeJ/fSIhlM+Jc4jfBKzPQ== ระยะทางจากบ้านถึงโรงเรียน (ทางน้ำ)
6jgdU7ihX8I0u4vqLal7YA== ระยะเวลาจากบ้านถึงโรงเรียน
bWapbgnTnmRbLxF/hG5HIA== ลักษณะการเดินทางมาโรงเรียน
*/

exports.schema = [
  {
    type:'student',  // dmc
    fields:[
      'efPeZGe28XhJ+cIUhqLSBQ==', // cid
      'AmrB7fxDKndu3eD/JTBxQQ==', // gender
      'mXHaTYOmL4k8kjOrVFS+4A==', // title
      'sFZFZLbpd2GLWX/6T/bAFw==', // first name
      'SdY5d42O0senWB3pVr0UrQ==', // last name
      'ui7YONiWMpAguuHUECvHtg==', // first name (en)
      '5FxsOSAwP3S1tMu/zhZ1Mg==', // last name (en)
      'PfewC115PY7G19xHOoyC6Q=='  // birthdate
    ]
  },
  {
    type:'dmc',  // dmc
    fields:[
      'efPeZGe28XhJ+cIUhqLSBQ==', // cid
      'L5hcQqye69tMkJGifwjraA==', // school id
      'FZEZ8EDgrK3sM9aUjMikeg==', // study grade 
      'XaPpI0R6r5+W+pmCzR70FQ==', // study room
      'moqfZUbSh1Yv+b9EoEscSg==',  // student id
      'record_as'
    ]
  },
  {
    type:'school', // school_info
    fields:[
      '0LKGe5ETMywEjU+p+SFGvA==', // area code
      'IHf9RK885Kqx2BDjX29m6g==', // area name
      'TUMQkGfq3smdyI/l/LZtew==', // school id
      'TbYgkcuqSBfov1tCZQLUJw==', // ministry id
      'ZyuDe9+wxOw8t4TIGokL8w==', // school name thai
      'HlW0AyS/efDdzkDyimsuRA=='  // school name eng
    ]
  }
]



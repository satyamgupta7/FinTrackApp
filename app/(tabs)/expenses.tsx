import { Colors } from '@/src/config/theme';
import { useFinance, Category } from '@/src/context/FinanceContext';
import type { MonthRow } from '@/src/config/expenseData';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert, Dimensions, Modal, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const SCREEN_W  = Dimensions.get('window').width;
const PADDING   = 32;
const COL_LABEL = 110;
const COL_DATA  = Math.floor((SCREEN_W - PADDING - COL_LABEL) / 2);
const ROW_H     = 40;

const CAT_COLORS  = ['#1B5E20','#E65100','#1565C0','#6A1B9A','#00695C','#B71C1C','#37474F','#F57F17','#4E342E'];
const MONTHS_LIST = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Row background highlight groups
const INCOME_KEYS   = new Set(['paycheck']);
const FIXED_KEYS    = new Set(['emi', 'invest', 'rent', 'insurance', 'medicine']);
const VARIABLE_KEYS = new Set(['personal', 'credit', 'familyCash']);

function blankMonth(label: string, cats: Category[]): MonthRow {
  const row: any = { month: label, paycheck: 0, emi: 0, invest: 0, rent: 0, insurance: 0, medicine: 0, personal: 0, credit: 0, familyCash: 0, totalSpend: 0, saving: null };
  cats.filter(c => !c.isSystem).forEach(c => { row[c.key] = 0; });
  return row;
}

export default function ExpensesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);

  const { expenseData: data, setExpenseData: setData, categories, setCategories } = useFinance();

  const [selectedYear, setSelectedYear] = useState('2026');
  const [startIdx, setStartIdx] = useState(() => Math.max(0, data.find(y => y.year === '2026')!.months.length - 2));

  const [editMonth, setEditMonth] = useState<MonthRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const [addMonthVisible, setAddMonthVisible] = useState(false);
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState('');

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ label: '', color: CAT_COLORS[0] });

  const yearData = data.find(y => y.year === selectedYear)!;
  const months   = yearData.months;
  const visible  = months.slice(startIdx, startIdx + 2);
  const last3    = months.slice(-3);

  function avg(arr: number[]) { return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length); }
  const avgIncome = avg(last3.map(m => m.paycheck));
  const avgSpend  = avg(last3.map(m => m.totalSpend));
  const avgSaving = avg(last3.map(m => m.saving ?? 0));

  // ── Month CRUD ──
  function handleAddMonth() {
    if (!newMonth || !newYear.trim()) { Alert.alert('Validation', 'Select month and enter year.'); return; }
    const label = `${newMonth}-${newYear.slice(-2)}`;
    const yr = newYear.trim();
    setData(prev => {
      const yd = prev.find(y => y.year === yr);
      if (yd?.months.find(m => m.month === label)) { Alert.alert('Exists', 'Month already added.'); return prev; }
      if (yd) return prev.map(y => y.year === yr ? { ...y, months: [...y.months, blankMonth(label, categories)] } : y);
      return [...prev, { year: yr, months: [blankMonth(label, categories)] }];
    });
    setSelectedYear(yr);
    setStartIdx(Math.max(0, (data.find(y => y.year === yr)?.months.length ?? 0) - 2));
    setAddMonthVisible(false); setNewMonth(''); setNewYear('');
  }

  function handleDeleteMonth(label: string) {
    Alert.alert('Delete Month', `Remove ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setData(prev => prev.map(y => y.year !== selectedYear ? y : { ...y, months: y.months.filter(m => m.month !== label) }));
        setStartIdx(i => Math.max(0, i - 1));
      }},
    ]);
  }

  // ── Month Edit ──
  function openEdit(month: MonthRow) {
    setEditMonth(month);
    const f: Record<string, string> = {};
    categories.forEach(c => { f[c.key] = String((month as any)[c.key] ?? ''); });
    setForm(f);
  }

  function handleSave() {
    if (!editMonth) return;
    setData(prev => prev.map(y => y.year !== selectedYear ? y : {
      ...y,
      months: y.months.map(m => m.month !== editMonth.month ? m : {
        ...m,
        ...Object.fromEntries(categories.map(c => [
          c.key,
          c.key === 'saving' ? (form[c.key] === '' ? null : Number(form[c.key])) : Number(form[c.key] ?? 0),
        ])),
      }),
    }));
    setEditMonth(null);
  }

  // ── Category CRUD ──
  function openEditCat(c: Category) { setEditCat(c); setCatForm({ label: c.label, color: c.color }); setCatModalVisible(true); }
  function openAddCat()              { setEditCat(null); setCatForm({ label: '', color: CAT_COLORS[0] }); setCatModalVisible(true); }

  function handleSaveCat() {
    if (!catForm.label.trim()) { Alert.alert('Validation', 'Enter category name.'); return; }
    if (editCat) {
      setCategories(prev => prev.map(c => c.key === editCat.key ? { ...c, label: catForm.label.toUpperCase(), color: catForm.color } : c));
    } else {
      const key = `${catForm.label.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      setCategories(prev => {
        const i = prev.findIndex(c => c.key === 'totalSpend');
        const next = [...prev];
        next.splice(i, 0, { key, label: catForm.label.toUpperCase(), color: catForm.color });
        return next;
      });
      setData(prev => prev.map(y => ({ ...y, months: y.months.map(m => ({ ...m, [key]: 0 })) })));
    }
    setCatModalVisible(false); setEditCat(null);
  }

  function handleDeleteCat(cat: Category) {
    if (cat.isSystem) { Alert.alert('System Category', 'Cannot delete system categories.'); return; }
    Alert.alert('Delete', `Remove "${cat.label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setCategories(prev => prev.filter(c => c.key !== cat.key));
        setData(prev => prev.map(y => ({ ...y, months: y.months.map(m => { const n = { ...m } as any; delete n[cat.key]; return n; }) })));
      }},
    ]);
  }

  const fmt = (v: any) => (v == null || v === 0) ? '—' : formatINR(v);
  const savingColor = (v: number | null) => v == null ? colors.icon : v >= 0 ? colors.income : colors.expense;

  function rowBg(key: string, ri: number) {
    if (INCOME_KEYS.has(key))   return colors.card;
    if (FIXED_KEYS.has(key))    return '#FF6D00' + '28';      // darker orange
    if (VARIABLE_KEYS.has(key)) return '#43A047' + '15';      // lighter green
    if (key === 'totalSpend')   return '#B71C1C' + '22';
    if (key === 'saving')       return '#1565C0' + '22';
    return ri % 2 === 0 ? colors.background : colors.card;
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>

        {/* Summary */}
        <View style={s.summaryRow}>
          {[
            { label: 'Avg Income', val: avgIncome, color: colors.income },
            { label: 'Avg Spend',  val: avgSpend,  color: colors.expense },
            { label: 'Avg Saving', val: avgSaving, color: avgSaving >= 0 ? colors.income : colors.expense },
          ].map(item => (
            <View key={item.label} style={[s.summaryCard, { borderTopColor: item.color }]}>
              <Text style={s.summaryLabel}>{item.label}</Text>
              <Text style={[s.summaryAmt, { color: item.color }]}>{formatINR(item.val)}</Text>
              <Text style={s.summaryNote}>Last 3 months</Text>
            </View>
          ))}
        </View>

        {/* Year Tabs */}
        <View style={s.yearTabs}>
          {data.map(y => (
            <TouchableOpacity key={y.year}
              style={[s.yearTab, selectedYear === y.year && s.yearTabActive]}
              onPress={() => { setSelectedYear(y.year); setStartIdx(Math.max(0, data.find(d => d.year === y.year)!.months.length - 2)); }}>
              <Text style={[s.yearTabText, selectedYear === y.year && s.yearTabTextActive]}>{y.year}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={s.actionRow}>
          <TouchableOpacity style={s.actionBtn} onPress={() => setAddMonthVisible(true)}>
            <Ionicons name="add-circle-outline" size={14} color={colors.tint} />
            <Text style={[s.actionText, { color: colors.tint }]}>Add Month</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { borderColor: '#6A1B9A' }]} onPress={openAddCat}>
            <Ionicons name="add-circle-outline" size={14} color="#6A1B9A" />
            <Text style={[s.actionText, { color: '#6A1B9A' }]}>Add Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { borderColor: '#37474F' }]} onPress={() => { setEditCat(null); setCatForm({ label: '', color: CAT_COLORS[0] }); setCatModalVisible(true); }}>
            <Ionicons name="settings-outline" size={14} color="#37474F" />
            <Text style={[s.actionText, { color: '#37474F' }]}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Navigator */}
        <View style={s.navRow}>
          <TouchableOpacity style={[s.navBtn, startIdx === 0 && s.navDisabled]} onPress={() => startIdx > 0 && setStartIdx(startIdx - 1)}>
            <Ionicons name="chevron-back" size={16} color={startIdx > 0 ? colors.tint : colors.border} />
          </TouchableOpacity>
          <Text style={s.navLabel}>{visible[0]?.month} — {visible[visible.length - 1]?.month}</Text>
          <TouchableOpacity style={[s.navBtn, startIdx + 2 >= months.length && s.navDisabled]} onPress={() => startIdx + 2 < months.length && setStartIdx(startIdx + 1)}>
            <Ionicons name="chevron-forward" size={16} color={startIdx + 2 < months.length ? colors.tint : colors.border} />
          </TouchableOpacity>
        </View>

        {/* Table */}
        <View style={s.tableWrapper}>

          {/* LEFT: Fixed label panel */}
          <View style={s.labelPanel}>
            <View style={[s.labelRow, s.tableHead]}>
              <Text style={[s.labelText, { color: '#fff' }]}>CATEGORY</Text>
            </View>
            {categories.map((cat, ri) => (
              <View key={cat.key} style={[s.labelRow, { backgroundColor: rowBg(cat.key, ri) }]}>
                <Text style={[s.labelText, { color: cat.color }, cat.key === 'totalSpend' && { fontWeight: '800' }]} numberOfLines={1}>
                  {cat.label}
                </Text>
                {!cat.isSystem && (
                  <View style={s.catBtns}>
                    <TouchableOpacity onPress={() => openEditCat(cat)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <Ionicons name="pencil" size={10} color="#1565C0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteCat(cat)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <Ionicons name="trash" size={10} color="#B71C1C" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* RIGHT: Scrollable data */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View>
              <View style={[s.dataRow, s.tableHead]}>
                {visible.map(m => (
                  <View key={m.month} style={s.dataHeadCell}>
                    <Text style={s.dataHeadText}>{m.month}</Text>
                    <TouchableOpacity onPress={() => openEdit(m)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                      <Ionicons name="pencil" size={10} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteMonth(m.month)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                      <Ionicons name="trash" size={10} color="#ffcdd2" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {categories.map((cat, ri) => {
                const isTotal  = cat.key === 'totalSpend';
                const isSaving = cat.key === 'saving';
                return (
                  <View key={cat.key} style={[s.dataRow, { backgroundColor: rowBg(cat.key, ri) }]}>
                    {visible.map(m => {
                      const val = (m as any)[cat.key] as number | null;
                      const color = isSaving ? savingColor(val) : isTotal ? colors.expense : colors.text;
                      return (
                        <Text key={m.month} style={[s.dataCell, { color }, (isTotal || isSaving) && { fontWeight: '700' }]}>
                          {fmt(val)}
                        </Text>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={s.legend}>
          {[
            { color: colors.card, label: 'Income', border: true },
            { color: '#FF6D00' + '28', label: 'Fixed Expense' },
            { color: '#43A047' + '15', label: 'Variable Expense' },
            { color: '#B71C1C' + '22', label: 'Total Spend' },
            { color: '#1565C0' + '22', label: 'Saving' },
          ].map(l => (
            <View key={l.label} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: l.color, borderWidth: 1, borderColor: colors.border }]} />
              <Text style={s.legendText}>{l.label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Edit Month Modal */}
      <Modal visible={!!editMonth} animationType="slide" transparent>
        <View style={s.overlay}>
          <ScrollView>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>Edit — {editMonth?.month}</Text>
              {categories.filter(c => c.key !== 'totalSpend').map(cat => (
                <View key={cat.key}>
                  <Text style={s.fieldLabel}>{cat.label}</Text>
                  <TextInput style={s.input} value={form[cat.key]} onChangeText={v => setForm({ ...form, [cat.key]: v })} keyboardType="numeric" placeholderTextColor={colors.icon} />
                </View>
              ))}
              <View style={s.modalBtns}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setEditMonth(null)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={s.saveBtn} onPress={handleSave}><Text style={s.saveText}>Update</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Month Modal */}
      <Modal visible={addMonthVisible} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Add Month</Text>
            <Text style={s.fieldLabel}>Select Month</Text>
            <View style={s.chipRow}>
              {MONTHS_LIST.map(mo => (
                <TouchableOpacity key={mo} style={[s.chip, newMonth === mo && s.chipActive]} onPress={() => setNewMonth(mo)}>
                  <Text style={[s.chipText, newMonth === mo && s.chipTextActive]}>{mo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.fieldLabel}>Year</Text>
            <TextInput style={s.input} value={newYear} onChangeText={setNewYear} keyboardType="numeric" placeholder="e.g. 2026" placeholderTextColor={colors.icon} />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setAddMonthVisible(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleAddMonth}><Text style={s.saveText}>Add</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Manage Modal */}
      <Modal visible={catModalVisible} animationType="slide" transparent>
        <View style={s.overlay}>
          <ScrollView>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>{editCat ? `Edit — ${editCat.label}` : 'Manage Categories'}</Text>

              {/* All categories list when not editing */}
              {!editCat && (
                <View style={s.catList}>
                  {categories.map(cat => (
                    <View key={cat.key} style={s.catListRow}>
                      <View style={[s.catDot, { backgroundColor: cat.color }]} />
                      <Text style={s.catListLabel} numberOfLines={1}>{cat.label}</Text>
                      <TouchableOpacity style={s.catListBtn} onPress={() => openEditCat(cat)}>
                        <Ionicons name="pencil" size={15} color="#1565C0" />
                      </TouchableOpacity>
                      {!cat.isSystem && (
                        <TouchableOpacity style={s.catListBtn} onPress={() => handleDeleteCat(cat)}>
                          <Ionicons name="trash" size={15} color="#B71C1C" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Edit / Add form */}
              {editCat && (
                <>
                  <Text style={s.fieldLabel}>Name</Text>
                  <TextInput style={s.input} value={catForm.label} onChangeText={v => setCatForm({ ...catForm, label: v })} placeholder="e.g. TRAVEL" placeholderTextColor={colors.icon} />
                  <Text style={s.fieldLabel}>Color</Text>
                  <View style={s.colorRow}>
                    {CAT_COLORS.map(c => (
                      <TouchableOpacity key={c} style={[s.colorDot, { backgroundColor: c }, catForm.color === c && s.colorDotActive]} onPress={() => setCatForm({ ...catForm, color: c })} />
                    ))}
                  </View>
                  <View style={s.modalBtns}>
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setEditCat(null)}><Text style={s.cancelText}>Back</Text></TouchableOpacity>
                    <TouchableOpacity style={s.saveBtn} onPress={handleSaveCat}><Text style={s.saveText}>Update</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {!editCat && (
                <TouchableOpacity style={[s.saveBtn, { marginTop: 16 }]} onPress={() => { setCatModalVisible(false); setEditCat(null); }}>
                  <Text style={s.saveText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Category Modal — separate from manage */}
    </View>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    summaryCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 10, borderTopWidth: 3, elevation: 1 },
    summaryLabel: { fontSize: 10, color: colors.icon, marginBottom: 3 },
    summaryAmt: { fontSize: 13, fontWeight: '800' },
    summaryNote: { fontSize: 9, color: colors.icon, marginTop: 2 },
    yearTabs: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    yearTab: { flex: 1, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
    yearTabActive: { backgroundColor: colors.tint, borderColor: colors.tint },
    yearTabText: { fontSize: 12, fontWeight: '600', color: colors.icon },
    yearTabTextActive: { color: '#fff' },
    actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.tint, backgroundColor: colors.card },
    actionText: { fontSize: 11, fontWeight: '600' },
    navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    navBtn: { padding: 6, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
    navDisabled: { opacity: 0.3 },
    navLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
    tableWrapper: { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    tableHead: { backgroundColor: colors.tint },
    labelPanel: { width: COL_LABEL, borderRightWidth: 1, borderRightColor: colors.border },
    labelRow: { height: ROW_H, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    labelText: { flex: 1, fontSize: 10, fontWeight: '600', color: colors.text },
    catBtns: { flexDirection: 'row', gap: 6 },
    dataRow: { flexDirection: 'row', height: ROW_H, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
    dataHeadCell: { width: COL_DATA, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 4 },
    dataHeadText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    dataCell: { width: COL_DATA, fontSize: 11, textAlign: 'right', paddingRight: 10, color: colors.text },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 12, height: 12, borderRadius: 3 },
    legendText: { fontSize: 10, color: colors.icon },
    overlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
    fieldLabel: { fontSize: 12, color: colors.icon, marginTop: 10, marginBottom: 3 },
    input: { backgroundColor: colors.background, borderRadius: 10, padding: 11, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
    modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
    cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    cancelText: { color: colors.text, fontWeight: '600' },
    saveBtn: { padding: 14, borderRadius: 12, backgroundColor: colors.tint, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: '700' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
    chipActive: { backgroundColor: colors.tint, borderColor: colors.tint },
    chipText: { fontSize: 12, color: colors.text },
    chipTextActive: { color: '#fff', fontWeight: '700' },
    catList: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
    catListRow: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
    catDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    catListLabel: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600' },
    catListBtn: { padding: 6 },
    colorRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotActive: { borderWidth: 3, borderColor: colors.text },
  });

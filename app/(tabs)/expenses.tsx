import { useTheme } from '@/src/hooks/useTheme';
import { useFinance, Category } from '@/src/context/FinanceContext';
import type { MonthRow } from '@/src/config/expenseData';
import { formatINR } from '@/src/utils/helpers';
import { CAT_COLORS, MONTHS_LIST, INCOME_KEYS, FIXED_KEYS, VARIABLE_KEYS } from '@/src/config/common.constants';
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

function blankMonth(label: string, cats: Category[]): MonthRow {
  const row: any = { month: label, paycheck: 0, emi: 0, invest: 0, rent: 0, insurance: 0, medicine: 0, personal: 0, credit: 0, familyCash: 0, totalSpend: 0, saving: null };
  cats.filter(c => !c.isSystem).forEach(c => { row[c.key] = 0; });
  return row;
}

export default function ExpensesScreen() {
  const { colors, styles: g } = useTheme();
  const { expenseData: data, setExpenseData: setData, categories, setCategories } = useFinance();

  const [selectedYear, setSelectedYear] = useState('2026');
  const [startIdx, setStartIdx] = useState(() => Math.max(0, data.find(y => y.year === '2026')!.months.length - 2));
  const [editMonth, setEditMonth]       = useState<MonthRow | null>(null);
  const [form, setForm]                 = useState<Record<string, string>>({});
  const [addMonthVisible, setAddMonthVisible] = useState(false);
  const [newMonth, setNewMonth]         = useState('');
  const [newYear, setNewYear]           = useState('');
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [editCat, setEditCat]           = useState<Category | null>(null);
  const [catForm, setCatForm]           = useState({ label: '', color: CAT_COLORS[0] });

  const yearData = data.find(y => y.year === selectedYear)!;
  const months   = yearData.months;
  const visible  = months.slice(startIdx, startIdx + 2);
  const last3    = months.slice(-3);

  function avg(arr: number[]) { return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0; }
  const avgIncome = avg(last3.map(m => m.paycheck));
  const avgSpend  = avg(last3.map(m => m.totalSpend));
  const avgSaving = avg(last3.map(m => m.saving ?? 0));

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
    if (FIXED_KEYS.has(key))    return '#FF6D0028';
    if (VARIABLE_KEYS.has(key)) return '#43A04715';
    if (key === 'totalSpend')   return '#B71C1C22';
    if (key === 'saving')       return '#1565C022';
    return ri % 2 === 0 ? colors.background : colors.card;
  }

  return (
    <View style={g.container}>
      <ScrollView contentContainerStyle={g.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Summary */}
        <View style={s.summaryRow}>
          {[
            { label: 'Avg Income', val: avgIncome, color: colors.income },
            { label: 'Avg Spend',  val: avgSpend,  color: colors.expense },
            { label: 'Avg Saving', val: avgSaving, color: avgSaving >= 0 ? colors.income : colors.expense },
          ].map(item => (
            <View key={item.label} style={[g.cardSm, s.summaryCard, { borderTopColor: item.color }]}>
              <Text style={[g.metaText, { fontSize: 10 }]}>{item.label}</Text>
              <Text style={[s.summaryAmt, { color: item.color }]}>{formatINR(item.val)}</Text>
              <Text style={[g.metaText, { fontSize: 9, marginTop: 2 }]}>Last 3 months</Text>
            </View>
          ))}
        </View>

        {/* Year Tabs */}
        <View style={g.yearTabs}>
          {data.map(y => (
            <TouchableOpacity key={y.year}
              style={[g.yearTab, { borderColor: colors.border, backgroundColor: colors.card }, selectedYear === y.year && { backgroundColor: colors.tint, borderColor: colors.tint }]}
              onPress={() => { setSelectedYear(y.year); setStartIdx(Math.max(0, data.find(d => d.year === y.year)!.months.length - 2)); }}>
              <Text style={[g.yearTabText, { color: colors.icon }, selectedYear === y.year && { color: '#fff' }]}>{y.year}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={g.expActionRow}>
          {[
            { label: 'Add Month',    icon: 'add-circle-outline', color: colors.tint, onPress: () => setAddMonthVisible(true) },
            { label: 'Add Category', icon: 'add-circle-outline', color: '#6A1B9A',   onPress: openAddCat },
            { label: 'Manage',       icon: 'settings-outline',   color: '#37474F',   onPress: () => { setEditCat(null); setCatForm({ label: '', color: CAT_COLORS[0] }); setCatModalVisible(true); } },
          ].map(a => (
            <TouchableOpacity key={a.label} style={[g.expActionBtn, { borderColor: a.color, backgroundColor: colors.card }]} onPress={a.onPress}>
              <Ionicons name={a.icon as any} size={14} color={a.color} />
              <Text style={[g.expActionText, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigator */}
        <View style={g.navRow}>
          <TouchableOpacity style={[g.navBtn, { backgroundColor: colors.card, borderColor: colors.border }, startIdx === 0 && { opacity: 0.3 }]} onPress={() => startIdx > 0 && setStartIdx(startIdx - 1)}>
            <Ionicons name="chevron-back" size={16} color={startIdx > 0 ? colors.tint : colors.border} />
          </TouchableOpacity>
          <Text style={[g.rowTitle, { fontSize: 13 }]}>{visible[0]?.month} — {visible[visible.length - 1]?.month}</Text>
          <TouchableOpacity style={[g.navBtn, { backgroundColor: colors.card, borderColor: colors.border }, startIdx + 2 >= months.length && { opacity: 0.3 }]} onPress={() => startIdx + 2 < months.length && setStartIdx(startIdx + 1)}>
            <Ionicons name="chevron-forward" size={16} color={startIdx + 2 < months.length ? colors.tint : colors.border} />
          </TouchableOpacity>
        </View>

        {/* Table */}
        <View style={[g.tableWrapper, { borderColor: colors.border }]}>
          <View style={[g.labelPanel, { borderRightColor: colors.border }]}>
            <View style={[g.labelRow, { backgroundColor: colors.tint, borderBottomColor: colors.border }]}>
              <Text style={[g.labelText, { color: '#fff' }]}>CATEGORY</Text>
            </View>
            {categories.map((cat, ri) => (
              <View key={cat.key} style={[g.labelRow, { backgroundColor: rowBg(cat.key, ri), borderBottomColor: colors.border }]}>
                <Text style={[g.labelText, { color: cat.color }, cat.key === 'totalSpend' && { fontWeight: '800' }]} numberOfLines={1}>
                  {cat.label}
                </Text>
                {!cat.isSystem && (
                  <View style={g.catBtns}>
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View>
              <View style={[s.dataRow, { backgroundColor: colors.tint, borderBottomColor: colors.border }]}>
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
                  <View key={cat.key} style={[s.dataRow, { backgroundColor: rowBg(cat.key, ri), borderBottomColor: colors.border }]}>
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
        <View style={[g.legend, { flexWrap: 'wrap', marginTop: 12 }]}>
          {[
            { color: colors.card, label: 'Income' },
            { color: '#FF6D0028', label: 'Fixed Expense' },
            { color: '#43A04715', label: 'Variable Expense' },
            { color: '#B71C1C22', label: 'Total Spend' },
            { color: '#1565C022', label: 'Saving' },
          ].map(l => (
            <View key={l.label} style={g.legendItem}>
              <View style={[s.legendDot, { backgroundColor: l.color, borderColor: colors.border }]} />
              <Text style={[g.legendText, { fontSize: 10 }]}>{l.label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Edit Month Modal */}
      <Modal visible={!!editMonth} animationType="slide" transparent>
        <View style={g.overlay}>
          <ScrollView>
            <View style={g.modalBox}>
              <Text style={g.modalTitle}>Edit — {editMonth?.month}</Text>
              {categories.filter(c => c.key !== 'totalSpend').map(cat => (
                <View key={cat.key}>
                  <Text style={g.fieldLabel}>{cat.label}</Text>
                  <TextInput style={g.input} value={form[cat.key]} onChangeText={v => setForm({ ...form, [cat.key]: v })} keyboardType="numeric" placeholderTextColor={colors.icon} />
                </View>
              ))}
              <View style={g.modalBtns}>
                <TouchableOpacity style={g.cancelBtn} onPress={() => setEditMonth(null)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={g.saveBtn} onPress={handleSave}><Text style={g.saveText}>Update</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Month Modal */}
      <Modal visible={addMonthVisible} animationType="slide" transparent>
        <View style={g.overlay}>
          <View style={g.modalBox}>
            <Text style={g.modalTitle}>Add Month</Text>
            <Text style={g.fieldLabel}>Select Month</Text>
            <View style={g.chipRow}>
              {MONTHS_LIST.map(mo => (
                <TouchableOpacity key={mo} style={[g.chip, { borderColor: colors.border, backgroundColor: colors.background }, newMonth === mo && { backgroundColor: colors.tint, borderColor: colors.tint }]} onPress={() => setNewMonth(mo)}>
                  <Text style={[g.chipText, { color: colors.text }, newMonth === mo && { color: '#fff', fontWeight: '700' }]}>{mo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={g.fieldLabel}>Year</Text>
            <TextInput style={g.input} value={newYear} onChangeText={setNewYear} keyboardType="numeric" placeholder="e.g. 2026" placeholderTextColor={colors.icon} />
            <View style={g.modalBtns}>
              <TouchableOpacity style={g.cancelBtn} onPress={() => setAddMonthVisible(false)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={g.saveBtn} onPress={handleAddMonth}><Text style={g.saveText}>Add</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal visible={catModalVisible} animationType="slide" transparent>
        <View style={g.overlay}>
          <ScrollView>
            <View style={g.modalBox}>
              <Text style={g.modalTitle}>{editCat ? `Edit — ${editCat.label}` : 'Manage Categories'}</Text>

              {!editCat && (
                <View style={[g.catList, { borderColor: colors.border }]}>
                  {categories.map(cat => (
                    <View key={cat.key} style={[g.catListRow, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                      <View style={[g.dotSm, { backgroundColor: cat.color, marginRight: 8 }]} />
                      <Text style={[g.rowTitle, { flex: 1, fontSize: 13 }]} numberOfLines={1}>{cat.label}</Text>
                      <TouchableOpacity style={g.catListBtn} onPress={() => openEditCat(cat)}>
                        <Ionicons name="pencil" size={15} color="#1565C0" />
                      </TouchableOpacity>
                      {!cat.isSystem && (
                        <TouchableOpacity style={g.catListBtn} onPress={() => handleDeleteCat(cat)}>
                          <Ionicons name="trash" size={15} color="#B71C1C" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {editCat && (
                <>
                  <Text style={g.fieldLabel}>Name</Text>
                  <TextInput style={g.input} value={catForm.label} onChangeText={v => setCatForm({ ...catForm, label: v })} placeholder="e.g. TRAVEL" placeholderTextColor={colors.icon} />
                  <Text style={g.fieldLabel}>Color</Text>
                  <View style={g.colorRow}>
                    {CAT_COLORS.map(c => (
                      <TouchableOpacity key={c} style={[g.colorDot, { backgroundColor: c }, catForm.color === c && g.colorDotSelected]} onPress={() => setCatForm({ ...catForm, color: c })} />
                    ))}
                  </View>
                  <View style={g.modalBtns}>
                    <TouchableOpacity style={g.cancelBtn} onPress={() => setEditCat(null)}><Text style={g.cancelText}>Back</Text></TouchableOpacity>
                    <TouchableOpacity style={g.saveBtn} onPress={handleSaveCat}><Text style={g.saveText}>Update</Text></TouchableOpacity>
                  </View>
                </>
              )}

              {!editCat && (
                <TouchableOpacity style={[g.saveBtn, { marginTop: 16 }]} onPress={() => { setCatModalVisible(false); setEditCat(null); }}>
                  <Text style={g.saveText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Only screen-specific layout values that depend on runtime dimensions
const s = StyleSheet.create({
  summaryRow:   { flexDirection: 'row', gap: 8, marginBottom: 14 },
  summaryCard:  { flex: 1, borderTopWidth: 3 },
  summaryAmt:   { fontSize: 13, fontWeight: '800', marginTop: 2 },
  dataRow:      { flexDirection: 'row', height: ROW_H, alignItems: 'center', borderBottomWidth: 1 },
  dataHeadCell: { width: COL_DATA, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 4 },
  dataHeadText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  dataCell:     { width: COL_DATA, fontSize: 11, textAlign: 'right', paddingRight: 10 },
  legendDot:    { width: 12, height: 12, borderRadius: 3, borderWidth: 1 },
});

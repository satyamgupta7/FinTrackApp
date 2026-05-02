import { StyleSheet, Dimensions } from 'react-native';
import type { AppColors } from '@/src/styles/theme';

const SCREEN_W      = Dimensions.get('window').width;
const LOAN_PADDING  = 16;
const COL_MONTH     = (SCREEN_W - LOAN_PADDING * 2) * 0.24;
const COL_AMT       = (SCREEN_W - LOAN_PADDING * 2 - COL_MONTH) / 3;

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // ── Layout ──────────────────────────────────────────────
    container:       { flex: 1, backgroundColor: colors.background },
    scrollContent:   { padding: 16 },
    scrollContent20: { padding: 20 },
    centered:        { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // ── Typography ──────────────────────────────────────────
    pageTitle:      { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
    sectionTitle:   { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
    sectionTitleSm: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
    label:          { fontSize: 12, color: colors.icon, marginBottom: 4, marginTop: 10 },
    fieldLabel:     { fontSize: 12, color: colors.icon, marginBottom: 4, marginTop: 10 },
    metaText:       { fontSize: 12, color: colors.icon },
    loadingText:    { fontSize: 14, color: colors.icon },

    // ── Auth ────────────────────────────────────────────────
    authInner:        { flex: 1, padding: 24, justifyContent: 'center' },
    authInnerGrow:    { flexGrow: 1, padding: 24, justifyContent: 'center' },
    authLogoRow:      { flexDirection: 'row', alignSelf: 'center', marginBottom: 24 },
    authLogoBox:      { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
    authLogoText:     { fontSize: 32, color: '#fff', fontWeight: '800' },
    authLogo:         { fontSize: 40, fontWeight: '900' },
    authTitle:        { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
    authSubtitle:     { textAlign: 'center', fontSize: 14, marginBottom: 28 },
    authPasswordBox:  { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, marginBottom: 14 },
    authPasswordInput:{ flex: 1, padding: 14, fontSize: 15 },
    authEyeBtn:       { paddingHorizontal: 14 },
    authFooter:       { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    authFooterLink:   { fontSize: 14, fontWeight: '700' },
    authRow:          { flexDirection: 'row' },
    authInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
    },

    // ── Navigation ──────────────────────────────────────────
    back:   { marginBottom: 8 },
    backLg: { marginBottom: 16 },

    // ── Cards ───────────────────────────────────────────────
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      elevation: 1,
    },
    cardSm: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      elevation: 1,
    },
    cardOverflow: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 1,
      marginBottom: 16,
    },

    // ── Section Row ─────────────────────────────────────────
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 12,
    },

    // ── Add Button ──────────────────────────────────────────
    addBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.tint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

    // ── Primary Button ──────────────────────────────────────
    btn:         { backgroundColor: colors.tint, borderRadius: 12, padding: 14, alignItems: 'center' },
    btnDisabled: { opacity: 0.6 },
    btnText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnOutline:  { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },

    // ── Input ───────────────────────────────────────────────
    input: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputDisabled: { opacity: 0.5 },

    // ── Progress Bar ────────────────────────────────────────
    progressBg:     { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
    progressFill:   { height: 8, borderRadius: 4 },
    progressBgSm:   { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
    progressFillSm: { height: 6, borderRadius: 3 },

    // ── Amount Row ──────────────────────────────────────────
    amountRow:   { flexDirection: 'row', alignItems: 'center' },
    amountBox:   { flex: 1, alignItems: 'center' },
    amountLabel: { fontSize: 11, color: colors.icon, marginBottom: 4 },
    amountValue: { fontSize: 15, fontWeight: '800', color: colors.text },
    divider:     { width: 1, height: 36, backgroundColor: colors.border },

    // ── Action Buttons ──────────────────────────────────────
    actions:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
    editBtn:   { padding: 6, backgroundColor: '#1565C015', borderRadius: 8 },
    deleteBtn: { padding: 6, backgroundColor: '#B71C1C15', borderRadius: 8 },

    // ── Color Picker ────────────────────────────────────────
    colorRow:         { flexDirection: 'row', gap: 10, marginTop: 8 },
    colorDot:         { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: colors.text },

    // ── Modal ───────────────────────────────────────────────
    overlay:      { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalBox:     { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle:   { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
    modalTitleLg: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
    modalBtns:    { flexDirection: 'row', gap: 12, marginTop: 20 },
    modalBtnsLg:  { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn:    { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    cancelText:   { color: colors.text, fontWeight: '600' },
    saveBtn:      { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.tint, alignItems: 'center' },
    saveText:     { color: '#fff', fontWeight: '700' },

    // ── List Row ────────────────────────────────────────────
    row:       { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    rowTitle:  { fontSize: 14, fontWeight: '600', color: colors.text },
    rowDesc:   { fontSize: 12, color: colors.icon, marginTop: 2 },
    iconBox:   { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    // ── Avatar ──────────────────────────────────────────────
    avatar:       { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.tint, justifyContent: 'center', alignItems: 'center' },
    avatarLg:     { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.tint, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText:   { color: '#fff', fontSize: 20, fontWeight: '700' },
    avatarTextLg: { color: '#fff', fontSize: 28, fontWeight: '800' },

    // ── Legend ──────────────────────────────────────────────
    legend:     { flexDirection: 'row', gap: 16, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot:  { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 11, color: colors.icon },

    // ── Stats Row ───────────────────────────────────────────
    statsRow:   { flexDirection: 'row', gap: 12, marginBottom: 12 },
    statCard:   { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 16, borderLeftWidth: 4, elevation: 1 },
    statLabel:  { fontSize: 12, color: colors.icon, marginBottom: 4 },
    statAmount: { fontSize: 16, fontWeight: '700' },

    // ── Info Row ────────────────────────────────────────────
    infoRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    infoText: { flex: 1, fontSize: 14, color: colors.text },

    // ── Dots ────────────────────────────────────────────────
    dot:   { width: 9, height: 9, borderRadius: 5 },
    dotSm: { width: 10, height: 10, borderRadius: 5 },

    // ── Dashboard ───────────────────────────────────────────
    greeting:       { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 2 },
    networthCard:   { backgroundColor: '#1565C0', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
    networthLabel:  { color: '#fff', fontSize: 14, opacity: 0.85 },
    networthAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
    networthSub:    { color: '#fff', fontSize: 12, opacity: 0.75, marginTop: 6 },
    cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardBadge:      { fontSize: 18, fontWeight: '800' },
    cardRow:        { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    breakRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    breakLabel:     { width: 56, fontSize: 12, color: colors.text },
    breakBarBg:     { flex: 1, height: 7, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.border },
    breakBarFill:   { height: 7, borderRadius: 4 },
    breakAmt:       { width: 68, fontSize: 11, fontWeight: '700', textAlign: 'right' },
    healthHeader:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    healthPct:      { fontSize: 18, fontWeight: '800', marginBottom: 6 },
    actionsRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    actionBtn:      { alignItems: 'center', gap: 6 },
    actionIcon:     { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

    // ── Hero Cards ──────────────────────────────────────────
    heroCard:   { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
    heroLabel:  { color: '#fff', fontSize: 12, opacity: 0.85 },
    heroAmount: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4 },

    // ── Help Hero ───────────────────────────────────────────
    helpHeroCard:  { backgroundColor: '#37474F', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, gap: 8 },
    helpHeroTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    helpHeroDesc:  { color: '#fff', fontSize: 13, opacity: 0.8 },
    faqItem:       { padding: 16 },
    faqQ:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqA:          { fontSize: 13, color: colors.icon, marginTop: 10, lineHeight: 20 },

    // ── Savings ─────────────────────────────────────────────
    summaryHeroCard:   { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 8 },
    summaryHeroLabel:  { color: '#fff', fontSize: 14, opacity: 0.85 },
    summaryHeroAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
    goalCard:          { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4 },
    goalName:          { fontSize: 15, fontWeight: '700', flex: 1, color: colors.text },

    // ── Loans ───────────────────────────────────────────────
    loanCard:    { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4 },
    loanHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    loanName:    { fontSize: 15, fontWeight: '700', color: colors.text },
    dueBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    dueText:     { fontSize: 12, fontWeight: '600' },
    viewAllBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.tint, marginTop: 4 },
    viewAllText: { fontWeight: '600', fontSize: 14, color: colors.tint },
    formRow:     { flexDirection: 'row' },

    // ── More Screen ─────────────────────────────────────────
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 1 },
    profileName: { fontSize: 18, fontWeight: '700', color: colors.text },
    logoutBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#B71C1C15', borderRadius: 12, padding: 16, marginTop: 20 },
    logoutText:  { color: '#B71C1C', fontSize: 15, fontWeight: '600' },

    // ── Profile Screen ──────────────────────────────────────
    avatarBox: { alignItems: 'center', marginBottom: 24 },
    userName:  { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },

    // ── Security Screen ─────────────────────────────────────
    sectionLabel: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', padding: 16, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },

    // ── Notifications Screen ────────────────────────────────
    notifSummaryCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E65100', borderRadius: 16, padding: 20, marginBottom: 20 },
    notifSummaryTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    notifSummaryDesc:  { color: '#fff', fontSize: 12, opacity: 0.85, marginTop: 2 },

    // ── About Screen ────────────────────────────────────────
    aboutLogoBox:    { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
    aboutLogo:       { fontSize: 44, fontWeight: '900' },
    aboutVersion:    { textAlign: 'center', marginBottom: 4 },
    aboutTagline:    { textAlign: 'center', fontSize: 15, marginBottom: 24, fontStyle: 'italic', color: colors.text },
    aboutDesc:       { fontSize: 14, lineHeight: 22, color: colors.icon },
    featureRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    featureBorder:   { borderBottomWidth: 1, borderBottomColor: colors.border },
    featureIconBox:  { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    featureText:     { fontSize: 14, color: colors.text },
    aboutFooter:     { alignItems: 'center', paddingVertical: 20, gap: 4 },
    aboutFooterText: { fontSize: 14, fontWeight: '600', color: colors.text },

    // ── Currency Settings ───────────────────────────────────
    currentCard:     { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 20, marginBottom: 24 },
    currentFlag:     { fontSize: 36 },
    currentCode:     { color: '#fff', fontSize: 20, fontWeight: '800' },
    currentName:     { color: '#fff', fontSize: 13, opacity: 0.85 },
    activeBadge:     { marginLeft: 'auto', backgroundColor: '#ffffff30', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    activeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    currencyFlag:    { fontSize: 28 },
    noteCard:        { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 4 },

    // ── Budget Planner ──────────────────────────────────────
    incomeCard:        { borderRadius: 16, padding: 20, marginBottom: 16 },
    incomeLabel:       { color: '#fff', fontSize: 13, opacity: 0.85, marginBottom: 6 },
    incomeInput:       { color: '#fff', fontSize: 28, fontWeight: '800' },
    budgetSummaryCard: { flex: 1, borderTopWidth: 3 },
    budgetSummaryAmt:  { fontSize: 16, fontWeight: '800', marginTop: 4 },
    progressHeader:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    budgetRow:         { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    budgetTop:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    budgetAmt:         { fontSize: 14, fontWeight: '700' },
    budgetBottom:      { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },

    // ── Reports ─────────────────────────────────────────────
    reportsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    reportsGridCard: { width: (SCREEN_W - 40 - 10) / 2, marginBottom: 0 },
    reportsGridAmt:  { fontSize: 15, fontWeight: '800', marginTop: 4 },
    barChart:        { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
    barCol:          { alignItems: 'center', flex: 1 },
    bar:             { width: 28, borderRadius: 4, marginVertical: 4 },
    barAmt:          { fontSize: 8, color: colors.icon, marginBottom: 2 },
    barLabel:        { fontSize: 9, fontWeight: '600', marginTop: 2, color: colors.text },
    barSaving:       { fontSize: 8, fontWeight: '600', marginTop: 1 },
    compareRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    compareMonth:    { width: 48, fontSize: 10, fontWeight: '600', color: colors.text },
    compareAmts:     { width: 80, alignItems: 'flex-end' },
    compareAmt:      { fontSize: 9, fontWeight: '600' },
    catRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    catLabel:        { width: 80, fontSize: 12, color: colors.text },
    catAmt:          { width: 70, fontSize: 11, fontWeight: '700', textAlign: 'right' },
    loanRow:         { marginBottom: 14 },
    loanTop:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    loanPct:         { fontSize: 12, fontWeight: '600' },
    loanAmts:        { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },

    // ── Loan Detail ─────────────────────────────────────────
    loanDetailHeader:      { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card },
    loanDetailBackBtn:     { marginRight: 12 },
    loanDetailTitle:       { fontSize: 17, fontWeight: '700', color: colors.text },
    loanDetailSummaryRow:  { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 8 },
    loanDetailSummaryCard: { flex: 1, borderTopWidth: 3 },
    loanDetailSummaryName: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
    loanDetailSummaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    loanDetailSummaryVal:  { fontSize: 11, fontWeight: '600', color: colors.text },
    tableRow:              { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
    tableHeadText:         { color: '#fff', fontWeight: '700' },
    tableCell:             { paddingVertical: 8, paddingHorizontal: 6, fontSize: 12, textAlign: 'right', color: colors.text },
    tableCellMonth:        { width: COL_MONTH, textAlign: 'left', fontWeight: '600' },
    tableCellAmt:          { width: COL_AMT },
    tableCurrentText:      { color: '#1B5E20', fontWeight: '700' },
    tableTotalCell:        { fontWeight: '700' },
    bottomNav:             { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card, paddingBottom: 20, paddingTop: 10 },
    bottomNavItem:         { flex: 1, alignItems: 'center', gap: 3 },

    // ── Expenses Table ──────────────────────────────────────
    expSummaryRow:  { flexDirection: 'row', gap: 8, marginBottom: 14 },
    expSummaryCard: { flex: 1, borderTopWidth: 3 },
    expSummaryAmt:  { fontSize: 13, fontWeight: '800', marginTop: 2 },
    yearTabs:       { flexDirection: 'row', gap: 8, marginBottom: 10 },
    yearTab:        { flex: 1, paddingVertical: 7, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
    yearTabText:    { fontSize: 12, fontWeight: '600' },
    expActionRow:   { flexDirection: 'row', gap: 8, marginBottom: 10 },
    expActionBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
    expActionText:  { fontSize: 11, fontWeight: '600' },
    navRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    navBtn:         { padding: 6, borderRadius: 8, borderWidth: 1 },
    tableWrapper:   { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
    labelPanel:     { width: 110, borderRightWidth: 1 },
    labelRow:       { height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderBottomWidth: 1 },
    labelText:      { flex: 1, fontSize: 10, fontWeight: '600' },
    catBtns:        { flexDirection: 'row', gap: 6 },
    dataRow:        { flexDirection: 'row', height: 40, alignItems: 'center', borderBottomWidth: 1 },
    dataHeadCell:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 4 },
    dataHeadText:   { fontSize: 11, fontWeight: '700', color: '#fff' },
    expLegendDot:   { width: 12, height: 12, borderRadius: 3, borderWidth: 1 },
    chipRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
    chip:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
    chipText:       { fontSize: 12 },
    catList:        { borderRadius: 10, overflow: 'hidden', borderWidth: 1, marginBottom: 8 },
    catListRow:     { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
    catListBtn:     { padding: 6 },
  });

export type AppStyles = ReturnType<typeof createStyles>;

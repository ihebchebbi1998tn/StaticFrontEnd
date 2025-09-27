import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useMemo } from 'react';

// Professional quote PDF layout with clean typography
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  
  // Clean Header Section - Full Width
  headerContainer: {
    backgroundColor: '#3B82F6',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  companyInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  // Logo container for header
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  logoImage: {
    width: 64,
    height: 64,
    marginRight: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  companyTagline: {
    fontSize: 10,
    color: '#DBEAFE',
  },
  quoteInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 4,
    minWidth: 160,
  },
  quoteTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  quoteNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quoteDate: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Content Container - Add padding back for content only
  contentContainer: {
    padding: 24,
    flex: 1,
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  
  // Info Cards
  customerCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    marginRight: 8,
  },
  
  quoteDetailsCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
    width: 70,
  },
  infoValue: {
    fontSize: 10,
    color: '#1F2937',
    flex: 1,
  },
  
  // Quote Details Section
  quoteDescriptionSection: {
    backgroundColor: '#F9FAFB',
    padding: 18,
    marginBottom: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },

  // Items Table
  tableSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  tableTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  posCol: { width: 40 },
  articleCol: { width: 70 },
  descCol: { flex: 1 },
  qtyCol: { width: 60, textAlign: 'right' },
  unitCol: { width: 60, textAlign: 'right' },
  amountCol: { width: 80, textAlign: 'right' },
  tableCellText: {
    fontSize: 10,
    color: '#1F2937',
  },
  positionNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  articleCode: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemDescription: {
    fontSize: 10,
    color: '#1F2937',
    lineHeight: 1.2,
  },
  quantityText: {
    fontSize: 10,
    color: '#1F2937',
  },
  unitText: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  summaryBox: {
    width: 220,
    backgroundColor: '#F9FAFB',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderTopColor: '#3B82F6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  // Professional Footer - Full Width
  footer: {
    backgroundColor: '#3B82F6',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    width: '100%',
  },
  footerLeft: {
    flex: 1,
  },
  footerText: {
    fontSize: 9,
    color: '#DBEAFE',
    lineHeight: 1.3,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  pageInfo: {
    fontSize: 9,
    color: '#DBEAFE',
  },
  
  // Status styling
  statusRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 10,
    color: '#6B7280',
    width: 70,
  },
  
  // Quote validity section
  validitySection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    borderLeftStyle: 'solid',
  },
  validityText: {
    fontSize: 9,
    color: '#92400E',
    textAlign: 'center',
  },
});

interface OfferPDFDocumentProps {
  offer: any;
  formatCurrency: (amount: number) => string;
  settings?: any;
}

export function OfferPDFDocument({ offer, formatCurrency, settings }: OfferPDFDocumentProps) {
  // Create dynamic styles based on settings
  const dynamicStyles = useMemo(() => {
    if (!settings) return styles;
    
    return StyleSheet.create({
      ...styles,
      page: {
        ...styles.page,
        fontFamily: settings.fontFamily || 'Helvetica',
        fontSize: settings.fontSize?.body || 10,
        backgroundColor: settings.colors?.background || '#FFFFFF',
        padding: 0,
      },
      headerContainer: {
        ...styles.headerContainer,
        backgroundColor: settings.colors?.primary || '#3B82F6',
        width: '100%',
      },
      companyName: {
        ...styles.companyName,
        fontSize: settings.fontSize?.header || 20,
        color: '#FFFFFF',
      },
      companyTagline: {
        ...styles.companyTagline,
        fontSize: settings.fontSize?.small || 9,
      },
      tableHeader: {
        ...styles.tableHeader,
        backgroundColor: settings.colors?.primary || '#3B82F6',
      },
      tableCellText: {
        ...styles.tableCellText,
        fontSize: settings.fontSize?.body || 10,
        color: settings.colors?.text || '#1F2937',
      },
      sectionTitle: {
        ...styles.sectionTitle,
        fontSize: settings.fontSize?.title || 11,
        color: settings.colors?.primary || '#3B82F6',
      },
      cardTitle: {
        ...styles.cardTitle,
        fontSize: settings.fontSize?.title || 11,
        color: settings.colors?.text || '#1F2937',
      },
      footer: {
        ...styles.footer,
        backgroundColor: settings.colors?.primary || '#3B82F6',
        width: '100%',
      },
    });
  }, [settings]);

  // Use provided settings or default values
  const config = settings || {
    fontFamily: 'Helvetica',
    fontSize: { header: 20, title: 11, body: 10, small: 9 },
    colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', text: '#1F2937', background: '#FFFFFF', border: '#E5E7EB' },
    margins: { top: 24, bottom: 24, left: 24, right: 24 },
    company: { name: 'YOUR COMPANY', tagline: 'Professional Business Solutions', address: '1234 Business Street, City, State 12345', phone: '(555) 123-4567', email: 'quotes@yourcompany.com', website: 'www.yourcompany.com' },
    showElements: { customerInfo: true, quoteInfo: true, itemsTable: true, summary: true, footer: true, logo: false, quoteDetails: true, pageNumbers: true },
    table: { showPositions: true, showArticleCodes: true, showQuantity: true, showUnitPrice: true, alternateRowColors: true },
    dateFormat: 'en-US',
    currencySymbol: '$',
    taxRate: 0,
    paperSize: 'A4',
  };

  const formatDate = (dateString: string | Date) => {
    const locale = config.dateFormat === 'en-US' ? 'en-US' : 
                   config.dateFormat === 'en-GB' ? 'en-GB' :
                   config.dateFormat === 'iso' ? 'sv-SE' : 'de-DE';
    
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Calculate totals
  let subtotal = 0;
  if (Array.isArray(offer.items)) {
    subtotal = offer.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.totalPrice) || 0);
    }, 0);
  }

  const taxRate = (offer.taxes || 0) / subtotal || 0;
  const taxAmount = offer.taxes || 0;
  const discount = offer.discount || 0;
  const total = offer.totalAmount || offer.amount || (subtotal + taxAmount - discount);

  return (
    <Document key={JSON.stringify(settings)}>
      <Page size={config.paperSize as any} style={dynamicStyles.page}>
        {/* Modern Professional Header - Full Width */}
        {config.showElements?.quoteDetails !== false && (
          <View style={dynamicStyles.headerContainer}>
            <View style={styles.companyInfo}>
              {config.showElements?.logo && config.company?.logo ? (
                <View style={styles.logoContainer}>
                  <Image src={config.company.logo as any} style={styles.logoImage} />
                  <View>
                    <Text style={dynamicStyles.companyName}>{config.company?.name || 'YOUR COMPANY'}</Text>
                    <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Professional Business Solutions'}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={dynamicStyles.companyName}>{config.company?.name || 'YOUR COMPANY'}</Text>
                  <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Professional Business Solutions'}</Text>
                </>
              )}
            </View>
            <View style={styles.quoteInfo}>
              <Text style={styles.quoteTitle}>QUOTE</Text>
              <Text style={styles.quoteNumber}>{offer.id}</Text>
              <Text style={styles.quoteDate}>
                {formatDate(new Date())}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Customer & Quote Details Grid */}
          {(config.showElements?.customerInfo !== false || config.showElements?.quoteInfo !== false) && (
            <View style={styles.infoGrid}>
              {config.showElements?.customerInfo !== false && (
                <View style={styles.customerCard}>
                  <Text style={dynamicStyles.sectionTitle}>Customer Information</Text>
                  <Text style={dynamicStyles.cardTitle}>{offer.contactName || 'Valued Customer'}</Text>
                  <Text style={styles.cardSubtitle}>{offer.contactCompany || 'Individual Customer'}</Text>
                  {offer.contactEmail && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{offer.contactEmail}</Text>
                    </View>
                  )}
                  {offer.contactPhone && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Phone:</Text>
                      <Text style={styles.infoValue}>{offer.contactPhone}</Text>
                    </View>
                  )}
                  {offer.contactAddress && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Address:</Text>
                      <Text style={styles.infoValue}>{offer.contactAddress}</Text>
                    </View>
                  )}
                </View>
              )}
              
              {config.showElements?.quoteInfo !== false && (
                <View style={styles.quoteDetailsCard}>
                  <Text style={dynamicStyles.sectionTitle}>Quote Details</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={styles.infoValue}>{offer.status?.toUpperCase() || 'DRAFT'}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Priority:</Text>
                    <Text style={styles.infoValue}>{offer.priority?.toUpperCase() || 'MEDIUM'}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Created:</Text>
                    <Text style={styles.infoValue}>{formatDate(offer.createdAt || new Date())}</Text>
                  </View>
                  {offer.validUntil && (
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Valid Until:</Text>
                      <Text style={styles.infoValue}>{formatDate(offer.validUntil)}</Text>
                    </View>
                  )}
                  {offer.assignedToName && (
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Assigned To:</Text>
                      <Text style={styles.infoValue}>{offer.assignedToName}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Quote Description */}
          {offer.description && (
            <View style={styles.quoteDescriptionSection}>
              <Text style={dynamicStyles.sectionTitle}>Description</Text>
              <Text style={styles.itemDescription}>{offer.description}</Text>
            </View>
          )}

          {/* Quote Validity Notice removed per user request */}

          {/* Items Table */}
          {config.showElements?.itemsTable !== false && offer.items && offer.items.length > 0 && (
            <View style={styles.tableSection}>
              <Text style={styles.tableTitle}>Quote Items</Text>
              <View style={styles.table}>
                <View style={dynamicStyles.tableHeader}>
                  {config.table?.showPositions && (
                    <View style={styles.posCol}>
                      <Text style={styles.tableHeaderText}>Pos</Text>
                    </View>
                  )}
                  {config.table?.showArticleCodes && (
                    <View style={styles.articleCol}>
                      <Text style={styles.tableHeaderText}>Code</Text>
                    </View>
                  )}
                  <View style={styles.descCol}>
                    <Text style={styles.tableHeaderText}>Description</Text>
                  </View>
                  {config.table?.showQuantity && (
                    <View style={styles.qtyCol}>
                      <Text style={styles.tableHeaderText}>Qty</Text>
                    </View>
                  )}
                  {config.table?.showUnitPrice && (
                    <View style={styles.unitCol}>
                      <Text style={styles.tableHeaderText}>Unit</Text>
                    </View>
                  )}
                  <View style={styles.amountCol}>
                    <Text style={styles.tableHeaderText}>Total</Text>
                  </View>
                </View>
                
                {offer.items.map((item: any, index: number) => (
                  <View 
                    key={item.id || index} 
                    style={[
                      styles.tableRow,
                      config.table?.alternateRowColors && index % 2 === 1 ? styles.tableRowAlt : {}
                    ]}
                  >
                    {config.table?.showPositions && (
                      <View style={styles.posCol}>
                        <Text style={styles.positionNumber}>{index + 1}</Text>
                      </View>
                    )}
                    {config.table?.showArticleCodes && (
                      <View style={styles.articleCol}>
                        <Text style={styles.articleCode}>{item.itemCode || '-'}</Text>
                      </View>
                    )}
                    <View style={styles.descCol}>
                      <Text style={styles.itemDescription}>{item.itemName}</Text>
                      {item.description && (
                        <Text style={styles.unitText}>{item.description}</Text>
                      )}
                    </View>
                    {config.table?.showQuantity && (
                      <View style={styles.qtyCol}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      </View>
                    )}
                    {config.table?.showUnitPrice && (
                      <View style={styles.unitCol}>
                        <Text style={styles.unitText}>{formatCurrency(item.unitPrice)}</Text>
                      </View>
                    )}
                    <View style={styles.amountCol}>
                      <Text style={dynamicStyles.tableCellText}>{formatCurrency(item.totalPrice)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Summary */}
          {config.showElements?.summary !== false && (
            <View style={styles.summarySection}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                {taxAmount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax ({Math.round(taxRate * 100)}%):</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
                  </View>
                )}
                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount:</Text>
                    <Text style={styles.summaryValue}>-{formatCurrency(discount)}</Text>
                  </View>
                )}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Notes */}
          {offer.notes && (
            <View style={styles.quoteDescriptionSection}>
              <Text style={dynamicStyles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.itemDescription}>{offer.notes}</Text>
            </View>
          )}
        </View>

        {/* Professional Footer - Full Width */}
        {config.showElements?.footer !== false && (
          <View style={dynamicStyles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>
                {config.company?.name || 'YOUR COMPANY'} • {config.company?.address || '1234 Business Street, City, State 12345'}
              </Text>
              <Text style={styles.footerText}>
                {config.company?.phone || '(555) 123-4567'} • {config.company?.email || 'quotes@yourcompany.com'} • {config.company?.website || 'www.yourcompany.com'}
              </Text>
              <Text style={styles.footerText}>
                Thank you for considering our quote. We look forward to working with you.
              </Text>
            </View>
            <View style={styles.footerRight}>
              {config.showElements?.pageNumbers && (
                <Text style={styles.pageInfo}>Page 1 of 1</Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
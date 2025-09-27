import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useMemo } from 'react';

// Professional service order PDF layout with consistent typography
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
    backgroundColor: '#2C3E50',
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
    color: '#BDC3C7',
  },
  orderInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 4,
    minWidth: 160,
  },
  orderTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 10,
    color: '#7F8C8D',
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
    backgroundColor: '#FAFBFC',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
    marginRight: 8,
  },
  
  serviceLocationCard: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    width: 65,
  },
  infoValue: {
    fontSize: 10,
    color: '#2C3E50',
    flex: 1,
  },
  
  // Service Details Section
  serviceDetailsSection: {
    backgroundColor: '#FAFBFC',
    padding: 18,
    marginBottom: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: '#2C3E50',
  },

  // Items Table
  tableSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
  },
  tableTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
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
    borderBottomColor: '#ECF0F1',
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#F8F9FA',
  },
  posCol: { width: 40 },
  articleCol: { width: 70 },
  descCol: { flex: 1 },
  qtyCol: { width: 60, textAlign: 'right' },
  unitCol: { width: 60, textAlign: 'right' },
  amountCol: { width: 80, textAlign: 'right' },
  tableCellText: {
    fontSize: 10,
    color: '#2C3E50',
  },
  positionNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  articleCode: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  itemDescription: {
    fontSize: 10,
    color: '#2C3E50',
    lineHeight: 1.2,
  },
  quantityText: {
    fontSize: 10,
    color: '#2C3E50',
  },
  unitText: {
    fontSize: 10,
    color: '#7F8C8D',
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  summaryBox: {
    width: 220,
    backgroundColor: '#FAFBFC',
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderTopColor: '#2C3E50',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#BDC3C7',
    borderTopStyle: 'solid',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  // Professional Footer - Full Width
  footer: {
    backgroundColor: '#2C3E50',
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
    color: '#BDC3C7',
    lineHeight: 1.3,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  pageInfo: {
    fontSize: 9,
    color: '#BDC3C7',
  },
  
  // Status styling
  statusRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    width: 65,
  },
});

interface SalePDFDocumentProps {
  sale: any;
  formatCurrency: (amount: number) => string;
  settings?: any;
}

export function SalePDFDocument({ sale, formatCurrency, settings }: SalePDFDocumentProps) {
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
        backgroundColor: settings.colors?.primary || '#2C3E50',
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
        backgroundColor: settings.colors?.primary || '#2C3E50',
      },
      tableCellText: {
        ...styles.tableCellText,
        fontSize: settings.fontSize?.body || 10,
        color: settings.colors?.text || '#2C3E50',
      },
      sectionTitle: {
        ...styles.sectionTitle,
        fontSize: settings.fontSize?.title || 11,
        color: settings.colors?.primary || '#2C3E50',
      },
      cardTitle: {
        ...styles.cardTitle,
        fontSize: settings.fontSize?.title || 11,
        color: settings.colors?.text || '#2C3E50',
      },
      footer: {
        ...styles.footer,
        backgroundColor: settings.colors?.primary || '#2C3E50',
        width: '100%',
      },
    });
  }, [settings]);

  // Use provided settings or default values
  const config = settings || {
    fontFamily: 'Helvetica',
    fontSize: { header: 20, title: 11, body: 10, small: 9 },
    colors: { primary: '#2C3E50', secondary: '#34495E', accent: '#3498DB', text: '#2C3E50', background: '#FFFFFF', border: '#E1E5E9' },
    margins: { top: 24, bottom: 24, left: 24, right: 24 },
    company: { name: 'PEAK SOLUTIONS', tagline: 'Mountain Service Excellence', address: '1234 Service Street, Tech City, TC 12345', phone: '(555) 123-4567', email: 'service@peaksolutions.com', website: 'www.peaksolutions.com' },
    showElements: { customerInfo: true, serviceLocation: true, itemsTable: true, summary: true, footer: true, logo: false, orderDetails: true, pageNumbers: true },
    table: { showPositions: true, showArticleCodes: true, showQuantity: true, showUnitPrice: true, alternateRowColors: true },
    dateFormat: 'de-DE',
    currencySymbol: '€',
    taxRate: 19,
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
  if (Array.isArray(sale.items)) {
    subtotal = sale.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.totalPrice) || 0);
    }, 0);
  }

  // For demonstration, assuming no tax or discount
  const taxRate = 0; // 0% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <Document key={JSON.stringify(settings)}>
      <Page size={config.paperSize as any} style={dynamicStyles.page}>
        {/* Modern Professional Header - Full Width */}
        {config.showElements?.orderDetails !== false && (
          <View style={dynamicStyles.headerContainer}>
            <View style={styles.companyInfo}>
              {config.showElements?.logo && config.company?.logo ? (
                <View style={styles.logoContainer}>
                  <Image src={config.company.logo as any} style={styles.logoImage} />
                  <View>
                    <Text style={dynamicStyles.companyName}>{config.company?.name || 'PEAK SOLUTIONS'}</Text>
                    <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Mountain Service Excellence'}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={dynamicStyles.companyName}>{config.company?.name || 'PEAK SOLUTIONS'}</Text>
                  <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Mountain Service Excellence'}</Text>
                </>
              )}
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderTitle}>Service Order</Text>
              <Text style={styles.orderNumber}>{sale.id}</Text>
              <Text style={styles.orderDate}>
                {formatDate(new Date())}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Customer & Service Location Grid */}
          {(config.showElements?.customerInfo !== false || config.showElements?.serviceLocation !== false) && (
            <View style={styles.infoGrid}>
              {config.showElements?.customerInfo !== false && (
                <View style={styles.customerCard}>
                  <Text style={dynamicStyles.sectionTitle}>Customer / Client</Text>
                  <Text style={dynamicStyles.cardTitle}>{sale.contactName || 'ServicePro Customer'}</Text>
                  <Text style={styles.cardSubtitle}>{sale.contactCompany || 'Individual Customer'}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>Customer Address Line 1</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ZIP:</Text>
                    <Text style={styles.infoValue}>12345 City Name</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Country:</Text>
                    <Text style={styles.infoValue}>Germany</Text>
                  </View>
                </View>
              )}
              
              {config.showElements?.serviceLocation !== false && (
                <View style={styles.serviceLocationCard}>
                  <Text style={dynamicStyles.sectionTitle}>Service Location</Text>
                  <Text style={dynamicStyles.cardTitle}>ServicePro Facility</Text>
                  <Text style={styles.cardSubtitle}>Main Service Center</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>1234 Service Street</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ZIP:</Text>
                    <Text style={styles.infoValue}>54321 Tech City</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Country:</Text>
                    <Text style={styles.infoValue}>Germany</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Service Order Details */}
          {config.showElements?.orderDetails !== false && (
            <View style={styles.serviceDetailsSection}>
              <Text style={dynamicStyles.sectionTitle}>Service Order Details</Text>
              {sale.title && (
                <Text style={dynamicStyles.cardTitle}>{sale.title}</Text>
              )}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[styles.infoValue, { color: '#1E293B', fontWeight: 'bold' }]}>
                  {(sale.status || 'In Progress').replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Priority:</Text>
                <Text style={styles.infoValue}>{sale.priority || 'Standard'}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Assigned:</Text>
                <Text style={styles.infoValue}>{sale.assignedToName || 'Service Team'}</Text>
              </View>
            </View>
          )}

          {/* Professional Items Table */}
          {config.showElements?.itemsTable !== false && sale.items && Array.isArray(sale.items) && sale.items.length > 0 && (
            <View style={styles.tableSection}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={dynamicStyles.tableHeader}>
                  {config.table?.showPositions !== false && <Text style={[styles.tableHeaderText, styles.posCol]}>POS</Text>}
                  {config.table?.showArticleCodes !== false && <Text style={[styles.tableHeaderText, styles.articleCol]}>ARTICLE</Text>}
                  <Text style={[styles.tableHeaderText, styles.descCol]}>DESCRIPTION</Text>
                  {config.table?.showQuantity !== false && <Text style={[styles.tableHeaderText, styles.qtyCol]}>QUANTITY</Text>}
                  {config.table?.showUnitPrice !== false && <Text style={[styles.tableHeaderText, styles.unitCol]}>UNIT</Text>}
                  <Text style={[styles.tableHeaderText, styles.amountCol]}>AMOUNT</Text>
                </View>
                
                {/* Table Rows */}
                {sale.items.map((item: any, index: number) => (
                    <View 
                      key={item.id || index} 
                      style={[
                        styles.tableRow,
                        (config.table?.alternateRowColors !== false && index % 2 === 1) ? styles.tableRowAlt : {},
                      index === sale.items.length - 1 ? { borderBottomWidth: 0 } : {}
                    ]}
                    >
                      {config.table?.showPositions !== false && (
                        <Text style={[styles.positionNumber, styles.posCol]}>
                          {String(index + 1).padStart(4, '0')}
                        </Text>
                      )}
                      {config.table?.showArticleCodes !== false && (
                        <Text style={[styles.articleCode, styles.articleCol]}>
                          {item.itemCode || 'ART' + String(index + 1)}
                        </Text>
                      )}
                      <Text style={[styles.itemDescription, styles.descCol]}>
                        {item.itemName || 'Service Item'}
                      </Text>
                      {config.table?.showQuantity !== false && (
                        <Text style={[styles.quantityText, styles.qtyCol]}>
                          {Number(item.quantity || 1).toFixed(2)}
                        </Text>
                      )}
                      {config.table?.showUnitPrice !== false && (
                        <Text style={[styles.unitText, styles.unitCol]}>
                          {item.type === 'article' ? 'Piece' : 'Hour'}
                        </Text>
                      )}
                      <Text style={[dynamicStyles.tableCellText, styles.amountCol]}>
                        {formatCurrency(item.totalPrice || 0)}
                      </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Compact Summary */}
          {config.showElements?.summary !== false && (
            <View style={styles.summarySection}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax ({config.taxRate || 19}%):</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal * ((config.taxRate || 19) / 100))}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(subtotal * (1 + ((config.taxRate || 19) / 100)))}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Professional Footer - Full Width */}
        {config.showElements?.footer !== false && (
          <View style={dynamicStyles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>
                {config.company?.name || 'ServicePro Auto Service Solutions'} • Phone: {config.company?.phone || '(555) 123-4567'} • Email: {config.company?.email || 'service@servicepro.com'}{'\n'}
                {config.company?.address || '1234 Service Street, Tech City, TC 12345'} • {config.company?.website || 'www.servicepro.com'}
              </Text>
            </View>
            <View style={styles.footerRight}>
              {(config.showElements as any)?.pageNumbers !== false && (
                <Text style={styles.pageInfo}>Page 1 of 1</Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

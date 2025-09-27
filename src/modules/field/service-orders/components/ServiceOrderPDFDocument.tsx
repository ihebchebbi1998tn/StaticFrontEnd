import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useMemo } from 'react';
import { format } from 'date-fns';

// Professional service order PDF layout with clean typography
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
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 4,
    minWidth: 160,
  },
  reportTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reportNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportDate: {
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
  
  serviceDetailsCard: {
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
  
  // Service Description Section
  serviceDescriptionSection: {
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

  // Services Table
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
  serviceCol: { flex: 1 },
  statusCol: { width: 80 },
  durationCol: { width: 80, textAlign: 'right' },
  costCol: { width: 80, textAlign: 'right' },
  tableCellText: {
    fontSize: 10,
    color: '#1F2937',
  },

  // Technician Summary Section
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
});

interface ServiceOrderPDFDocumentProps {
  serviceOrder: any;
  formatCurrency: (amount: number) => string;
  settings?: any;
}

export function ServiceOrderPDFDocument({ serviceOrder, formatCurrency, settings }: ServiceOrderPDFDocumentProps) {
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
    company: { name: 'YOUR COMPANY', tagline: 'Professional Field Services', address: '1234 Business Street, City, State 12345', phone: '(555) 123-4567', email: 'service@yourcompany.com', website: 'www.yourcompany.com' },
    showElements: { customerInfo: true, serviceOrderInfo: true, servicesTable: true, technicianSummary: true, footer: true, logo: false, serviceOrderDetails: true, pageNumbers: true },
    table: { showPositions: true, showServiceCodes: true, showDuration: true, showCost: true, alternateRowColors: true },
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

  // Calculate technician totals
  const totalLaborCost = serviceOrder.financials?.laborCost || 0;
  const totalMaterialCost = serviceOrder.financials?.materialCost || 0;
  const totalTravelCost = serviceOrder.financials?.travelCost || 0;
  const totalCost = serviceOrder.financials?.totalAmount || 0;
  
  // Calculate total hours from time tracking
  const totalHours = serviceOrder.workDetails?.timeTracking?.reduce((sum: number, time: any) => {
    return sum + (time.duration || 0);
  }, 0) || 0;

  return (
    <Document key={JSON.stringify(settings)}>
      <Page size={config.paperSize as any} style={dynamicStyles.page}>
        {/* Modern Professional Header - Full Width */}
        {config.showElements?.serviceOrderDetails !== false && (
          <View style={dynamicStyles.headerContainer}>
            <View style={styles.companyInfo}>
              {config.showElements?.logo && config.company?.logo ? (
                <View style={styles.logoContainer}>
                  <Image src={config.company.logo as any} style={styles.logoImage} />
                  <View>
                    <Text style={dynamicStyles.companyName}>{config.company?.name || 'YOUR COMPANY'}</Text>
                    <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Professional Field Services'}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={dynamicStyles.companyName}>{config.company?.name || 'YOUR COMPANY'}</Text>
                  <Text style={dynamicStyles.companyTagline}>{config.company?.tagline || 'Professional Field Services'}</Text>
                </>
              )}
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>SERVICE REPORT</Text>
              <Text style={styles.reportNumber}>{serviceOrder.orderNumber}</Text>
              <Text style={styles.reportDate}>
                {formatDate(new Date())}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Customer & Service Order Details Grid */}
          {(config.showElements?.customerInfo !== false || config.showElements?.serviceOrderInfo !== false) && (
            <View style={styles.infoGrid}>
              {config.showElements?.customerInfo !== false && (
                <View style={styles.customerCard}>
                  <Text style={dynamicStyles.sectionTitle}>Customer Information</Text>
                  <Text style={dynamicStyles.cardTitle}>{serviceOrder.customer.contactPerson}</Text>
                  <Text style={styles.cardSubtitle}>{serviceOrder.customer.company}</Text>
                  {serviceOrder.customer.email && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{serviceOrder.customer.email}</Text>
                    </View>
                  )}
                  {serviceOrder.customer.phone && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Phone:</Text>
                      <Text style={styles.infoValue}>{serviceOrder.customer.phone}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoValue}>
                      {serviceOrder.customer.address.street}, {serviceOrder.customer.address.city}, {serviceOrder.customer.address.state} {serviceOrder.customer.address.zipCode}
                    </Text>
                  </View>
                </View>
              )}

              {config.showElements?.serviceOrderInfo !== false && (
                <View style={styles.serviceDetailsCard}>
                  <Text style={dynamicStyles.sectionTitle}>Service Details</Text>
                  <Text style={dynamicStyles.cardTitle}>Order #{serviceOrder.orderNumber}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={styles.infoValue}>{serviceOrder.status.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Priority:</Text>
                    <Text style={styles.infoValue}>{serviceOrder.priority.toUpperCase()}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Created:</Text>
                    <Text style={styles.infoValue}>{formatDate(serviceOrder.createdAt)}</Text>
                  </View>
                  {serviceOrder.repair?.location && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Location:</Text>
                      <Text style={styles.infoValue}>{serviceOrder.repair.location}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Service Description */}
          {serviceOrder.repair?.description && config.showElements?.serviceOrderDetails !== false && (
            <View style={styles.serviceDescriptionSection}>
              <Text style={dynamicStyles.sectionTitle}>Service Description</Text>
              <Text style={dynamicStyles.cardTitle}>Work Required</Text>
              <Text style={styles.infoValue}>{serviceOrder.repair.description}</Text>
            </View>
          )}

          {/* Services/Jobs Table */}
          {config.showElements?.servicesTable !== false && serviceOrder.jobs && serviceOrder.jobs.length > 0 && (
            <View style={styles.tableSection}>
              <Text style={styles.tableTitle}>Services Performed</Text>
              <View style={styles.table}>
                <View style={dynamicStyles.tableHeader}>
                  {config.table?.showPositions && (
                    <View style={styles.posCol}>
                      <Text style={styles.tableHeaderText}>#</Text>
                    </View>
                  )}
                  <View style={styles.serviceCol}>
                    <Text style={styles.tableHeaderText}>Service</Text>
                  </View>
                  <View style={styles.statusCol}>
                    <Text style={styles.tableHeaderText}>Status</Text>
                  </View>
                  {config.table?.showDuration && (
                    <View style={styles.durationCol}>
                      <Text style={styles.tableHeaderText}>Duration</Text>
                    </View>
                  )}
                  {config.table?.showCost && (
                    <View style={styles.costCol}>
                      <Text style={styles.tableHeaderText}>Cost</Text>
                    </View>
                  )}
                </View>

                {serviceOrder.jobs.map((job: any, index: number) => (
                  <View 
                    key={job.id} 
                    style={[
                      styles.tableRow,
                      config.table?.alternateRowColors && index % 2 === 1 ? styles.tableRowAlt : null
                    ]}
                  >
                    {config.table?.showPositions && (
                      <View style={styles.posCol}>
                        <Text style={dynamicStyles.tableCellText}>{index + 1}</Text>
                      </View>
                    )}
                    <View style={styles.serviceCol}>
                      <Text style={dynamicStyles.tableCellText}>{job.title}</Text>
                      {job.description && (
                        <Text style={[dynamicStyles.tableCellText, { fontSize: 8, color: '#6B7280' }]}>
                          {job.description}
                        </Text>
                      )}
                    </View>
                    <View style={styles.statusCol}>
                      <Text style={dynamicStyles.tableCellText}>{job.status.replace('_', ' ')}</Text>
                    </View>
                    {config.table?.showDuration && (
                      <View style={styles.durationCol}>
                        <Text style={dynamicStyles.tableCellText}>
                          {job.estimatedDuration ? `${Math.round(job.estimatedDuration / 60)}h` : '-'}
                        </Text>
                      </View>
                    )}
                    {config.table?.showCost && (
                      <View style={styles.costCol}>
                        <Text style={dynamicStyles.tableCellText}>
                          {job.estimatedCost ? formatCurrency(job.estimatedCost) : '-'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Technician Summary */}
          {config.showElements?.technicianSummary !== false && (
            <View style={styles.summarySection}>
              <View style={styles.summaryBox}>
                <Text style={dynamicStyles.sectionTitle}>Cost Summary</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Labor Cost:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalLaborCost)}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Materials:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalMaterialCost)}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Travel:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(totalTravelCost)}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Hours:</Text>
                  <Text style={styles.summaryValue}>{Math.round(totalHours / 60)}h</Text>
                </View>
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Cost:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
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
                {config.company?.name || 'YOUR COMPANY'} • {config.company?.address || 'Business Address'}
              </Text>
              <Text style={styles.footerText}>
                {config.company?.phone || 'Phone'} • {config.company?.email || 'Email'} • {config.company?.website || 'Website'}
              </Text>
            </View>
            <View style={styles.footerRight}>
              {config.showElements?.pageNumbers !== false && (
                <Text style={styles.pageInfo}>
                  Page 1 of 1
                </Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
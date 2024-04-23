import React, { useEffect, useState, ReactNode } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ApiService from '../../services/apiService';
import { API_INVOICE } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';

interface BookingDetails {
  [key: string]: ReactNode;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb',
    marginTop: '1rem',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
  },
  th: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#f5f7f9',
    color: '#374151',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  td: {
    flex: 1,
    padding: '0.5rem',
    textAlign: 'left',
  },
});

const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showtimeId = searchParams.get('showtime_id');
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    if (id && showtimeId) {
      try {
        const response = await ApiService.get(API_INVOICE(id, showtimeId));
        setBookingData(response.data.booking);
        setBookingDetails(response.data.booking_details);
      } catch (error) {
        toast.error(`${error}`)
      }
    }
  };

  const downloadPDF = async () => {
    const pdfDoc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Invoice for Booking #{bookingData?.id}</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={styles.th}>Attribute</Text>
                <Text style={styles.th}>Value</Text>
              </View>
              {/* Table Body */}
              {Object.entries(bookingDetails).map(([attribute, attrValue]) => (
                <View key={attribute} style={styles.tableRow}>
                  <Text style={styles.td}>{attribute}</Text>
                  <Text style={styles.td}>{attrValue}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
    const blob = await pdf(pdfDoc).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-4">Invoice for Booking #{bookingData?.id}</h1>
  
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-gray-100">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border py-2 px-4 text-left">Attribute</th>
                  <th className="border py-2 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bookingDetails).map(([attribute, attrValue]) => (
                  <tr key={attribute} className="border-b">
                    <td className="border py-2 px-4 text-left font-semibold">{attribute}</td>
                    <td className="border py-2 px-4">{attrValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="mt-6 flex justify-end space-x-4">
            <Link
              to="/bookings"
              className="btn btn-secondary rounded-md px-6 py-2 text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              Back
            </Link>
            <button
              onClick={downloadPDF}
              className="btn btn-primary rounded-md px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 ease-in-out"
              id="downloadButton"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;

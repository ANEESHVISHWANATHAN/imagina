import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "./Converter.css";

const Converter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setConverted(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setConverted(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await fetch("https://imagina.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      // Receive the converted image as a blob
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Automatically trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `converted.${format}`;
      link.click();

      setConverted(true);
    } catch (error) {
      console.error("Error converting file:", error);
      alert("Conversion failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="converter">
      <Paper elevation={4} className="converter-container">
        <Typography variant="h4" className="converter-title">
          IMAGINA Converter
        </Typography>
        <Typography variant="body2" className="converter-subtitle">
          Convert your images effortlessly between formats.
        </Typography>

        <Box className="upload-section">
          {!file ? (
            <>
              <CloudUploadIcon className="upload-icon" />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Drag & drop or click to upload
              </Typography>
              <Button
                variant="contained"
                component="label"
                color="info"
                sx={{ borderRadius: "20px", textTransform: "none" }}
              >
                Browse Files
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>
            </>
          ) : (
            <Box className="file-details">
              <Typography variant="body1" sx={{ mb: 1 }}>
                File: {file.name}
              </Typography>
              <FormControl size="small" sx={{ mb: 2, minWidth: 140 }}>
                <InputLabel id="format-label">Convert to</InputLabel>
                <Select
                  labelId="format-label"
                  value={format}
                  label="Convert to"
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="jpg">JPG</MenuItem>
                  <MenuItem value="webp">WEBP</MenuItem>
                  <MenuItem value="gif">GIF</MenuItem>
                </Select>
              </FormControl>

              {loading ? (
                <CircularProgress color="info" />
              ) : converted ? (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<DoneAllIcon />}
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                >
                  Converted Successfully
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleConvert}
                  startIcon={<SwapHorizIcon />}
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                >
                  Convert
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Converter;

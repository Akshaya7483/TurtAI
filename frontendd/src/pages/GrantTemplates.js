import React from 'react';
import '../styles/GrantTemplates.css';

function GrantTemplates() {
  return (
    <div className="grant-templates-container">
      <header className="header">
        <h1>Grant Writing Templates & Training Videos</h1>
        <p>Your one-stop resource for grant writing templates and video tutorials.</p>
      </header>

      {/* Videos Section */}
      <section className="videos-section">
        <h2>Training Videos</h2>
        <p>Watch our tutorials to learn essential grant writing skills.</p>

        <div className="video-library">
          {/* Big Buck Bunny */}
          <div className="video-item">
            <video controls width="100%" height="300">
              <source src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3>Big Buck Bunny</h3>
          </div>

          {/* Sample Video from Archive.org */}
          <div className="video-item">
            <video controls width="100%" height="300">
              <source src="https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3>Sample Video from Archive.org</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GrantTemplates;

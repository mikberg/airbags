import React from 'react';
import Site from '../../src/components/Site';
import Menu from '../../src/components/Menu';

export default class CustomSite extends Site {
  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" />
          <link href="/blog.css" rel="stylesheet" />
          <title>My Supercool Blog</title>
        </head>
        <body>
          <div className="blog-masthead">
            <div className="container">
              <nav className="blog-nav">
                <a className="blog-nav-item active" href="#">Home</a>
                <a className="blog-nav-item" href="#">New features</a>
                <a className="blog-nav-item" href="#">Press</a>
                <a className="blog-nav-item" href="#">New hires</a>
                <a className="blog-nav-item" href="#">About</a>
              </nav>
            </div>
          </div>

          <div className="container">
            <div className="blog-header">
              <h1 className="blog-title">My Supercool Blog</h1>
              <p className="lead blog-description">The official example template of creating a blog with Bootstrap.</p>
            </div>
            {this.renderRouter()}
          </div>

          <Menu />
        </body>
      </html>
    );
  }
}
